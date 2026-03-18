import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, Filter, X, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import config from '../../config';
import { useCurrency } from '../../CurrencyContext';
import './MentorSearchPage.css';

const API_URL = config.API_BASE_URL;

const DOMAINS = ['Software Engineering','Data Science','Machine Learning','Product Management','UX/UI Design','DevOps','Cybersecurity','Finance','Marketing','Entrepreneurship','Healthcare','Career Guidance'];
const SERVICE_TYPES = [
  { value:'', label:'All Types' },
  { value:'one_on_one', label:'1:1 Session' },
  { value:'quick_chat', label:'Quick Chat' },
  { value:'mock_interview', label:'Mock Interview' },
  { value:'priority_dm', label:'Priority DM' },
  { value:'resume_review', label:'Resume Review' },
  { value:'referral', label:'Referral' },
  { value:'course', label:'Course' },
  { value:'workshop', label:'Workshop' },
  { value:'coaching_series', label:'Coaching Series' },
];

const SORT_OPTIONS = [
  { value:'featured', label:'⭐ Featured' },
  { value:'rating', label:'Highest Rated' },
  { value:'bookings', label:'Most Booked' },
  { value:'newest', label:'Newest' },
  { value:'price_asc', label:'Lowest Price' },
];

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati'];

const MentorCard = ({ mentor, onClick }) => {
  const { convertPrice, currencySymbol } = useCurrency();

  const image = mentor.profileImage || mentor.userId?.imageUrl;
  const title = mentor.displayName || 'Mentor';
  const headline = mentor.bio || mentor.userId?.jobTitle || mentor.location?.city || 'Industry mentor';
  const tags = mentor.expertise || mentor.skills || [];

  return (
  <article className="mentor-card" onClick={onClick}>
    <div className="mentor-card-image-wrap">
      {image ? (
        <img src={image} alt={title} />
      ) : (
        <div className="mentor-card-fallback">{title?.[0]?.toUpperCase() || 'M'}</div>
      )}
    </div>

    <div className="mentor-card-body">
      <h3 className="mentor-card-title">{title}</h3>
      <p className="mentor-card-headline">{headline}</p>

      {tags.length > 0 && (
        <div className="mentor-tag-row">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={`${mentor._id || mentor.handle || idx}-${tag}-${idx}`} className="mentor-tag">{tag}</span>
          ))}
          {tags.length > 3 && <span className="mentor-tag">+{tags.length - 3}</span>}
        </div>
      )}

      <div className="mentor-meta-row">
        <div className="mentor-meta-left">
          {mentor.averageRating > 0 && (
            <span className="mentor-meta-item">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              {mentor.averageRating.toFixed(1)} ({mentor.totalReviews || 0})
            </span>
          )}

          {mentor.totalMentees > 0 && (
            <span className="mentor-meta-item">
              <Users size={12} />
              {mentor.totalMentees}
            </span>
          )}
        </div>

        <div className="mentor-price">
          {mentor.startingPrice > 0
            ? `From ${currencySymbol}${convertPrice(mentor.startingPrice, mentor.preferredCurrency || 'INR')?.toLocaleString()}`
            : 'Free available'}
        </div>
      </div>
    </div>
  </article>
  );
};

export default function MentorSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [serviceType, setServiceType] = useState(searchParams.get('serviceType') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const initialPage = Number(searchParams.get('page') || 1);
  const [page, setPage] = useState(Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);
  const [showFilters, setShowFilters] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const fetchMentors = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { sort, page: pg, limit: 12 };
      if (q) params.q = q;
      if (domain) params.domain = domain;
      if (serviceType) params.serviceType = serviceType;
      if (minRating) params.minRating = minRating;
      if (maxPrice) params.maxPrice = maxPrice;
      if (language) params.language = language;
      const res = await axios.get(`${API_URL}/mentor/search`, { params });
      setMentors(res.data.mentors || []);
      setPagination(res.data.pagination);
    } catch(e) {
      console.error('Failed to fetch mentors:', e);
    }
    setLoading(false);
  }, [q, domain, serviceType, minRating, maxPrice, language, sort]);

  useEffect(() => {
    setPage(1);
  }, [q, domain, serviceType, minRating, maxPrice, language, sort]);

  useEffect(() => {
    fetchMentors(page);
    // Update URL
    const p = {};
    if (q) p.q = q;
    if (domain) p.domain = domain;
    if (serviceType) p.serviceType = serviceType;
    if (minRating) p.minRating = minRating;
    if (maxPrice) p.maxPrice = maxPrice;
    if (language) p.language = language;
    if (sort !== 'featured') p.sort = sort;
    if (page > 1) p.page = String(page);
    setSearchParams(p);
  }, [fetchMentors, page, q, domain, serviceType, minRating, maxPrice, language, sort, setSearchParams]);

  const hasFilters = domain || serviceType || minRating || maxPrice || language;
  const activeFilterCount = [domain, serviceType, minRating, maxPrice, language].filter(Boolean).length;
  const clearFilters = () => {
    setDomain('');
    setServiceType('');
    setMinRating('');
    setMaxPrice('');
    setLanguage('');
  };

  const totalPages = pagination?.totalPages || 1;
  const boundedPage = Math.min(Math.max(1, page), totalPages);
  const pageStart = Math.max(1, boundedPage - 2);
  const pageEnd = Math.min(totalPages, boundedPage + 2);
  const pageButtons = [];
  for (let i = pageStart; i <= pageEnd; i += 1) pageButtons.push(i);

  const from = pagination?.total ? (boundedPage - 1) * 12 + 1 : 0;
  const to = pagination?.total ? Math.min(boundedPage * 12, pagination.total) : 0;

  return (
    <div className="mentor-search-page">
      <section className="mentor-hero">
        <h1>Find Your Perfect Mentor</h1>
        <p>Browse verified mentors, apply filters, and book the right person for your goals.</p>

        <div className="mentor-search-row">
          <Search size={18} className="mentor-search-icon" />
          <input
            className="mentor-search-input"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, skill, domain"
          />
          <button type="button" className="mentor-search-button" onClick={() => setPage(1)}>
            Search
          </button>
        </div>
      </section>

      <div className="mentor-toolbar">
        <div className="mentor-toolbar-left">
          <button
            type="button"
            className={`mentor-filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter size={14} />
            Filters
            {hasFilters && (
              <span className={`mentor-filter-count ${showFilters ? '' : 'idle'}`}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasFilters && (
            <button type="button" className="mentor-clear-filters" onClick={clearFilters}>
              <X size={13} /> Clear
            </button>
          )}

          {pagination && (
            <span className="mentor-total-label">
              {pagination.total} mentor{pagination.total !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        <select className="mentor-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {showFilters && (
        <section className="mentor-filters-panel">
          <div className="mentor-filter-field">
            <label>Domain</label>
            <select value={domain} onChange={e => setDomain(e.target.value)}>
              <option value="">All Domains</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="mentor-filter-field">
            <label>Service Type</label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)}>
              {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="mentor-filter-field">
            <label>Min Rating</label>
            <select value={minRating} onChange={e => setMinRating(e.target.value)}>
              <option value="">Any Rating</option>
              <option value="4">⭐ 4+</option>
              <option value="3">⭐ 3+</option>
              <option value="2">⭐ 2+</option>
            </select>
          </div>

          <div className="mentor-filter-field">
            <label>Max Price</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 5000" />
          </div>

          <div className="mentor-filter-field">
            <label>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="">All Languages</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </section>
      )}

      {hasFilters && (
        <div className="mentor-active-chips">
          {domain && <span className="mentor-chip">Domain: {domain} <button type="button" onClick={() => setDomain('')}>x</button></span>}
          {serviceType && <span className="mentor-chip">Type: {SERVICE_TYPES.find(s => s.value === serviceType)?.label} <button type="button" onClick={() => setServiceType('')}>x</button></span>}
          {minRating && <span className="mentor-chip">Rating: {minRating}+ <button type="button" onClick={() => setMinRating('')}>x</button></span>}
          {maxPrice && <span className="mentor-chip">Max: {maxPrice} <button type="button" onClick={() => setMaxPrice('')}>x</button></span>}
          {language && <span className="mentor-chip">Language: {language} <button type="button" onClick={() => setLanguage('')}>x</button></span>}
        </div>
      )}

      {loading && mentors.length === 0 ? (
        <div className="mentor-loading">
          Loading mentors...
        </div>
      ) : mentors.length === 0 ? (
        <div className="mentor-empty">
          <h3>No mentors found</h3>
          <p>Try adjusting your search or filters.</p>
          {hasFilters && (
            <button type="button" className="mentor-search-button" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mentor-grid">
            {mentors.map(m => (
              <MentorCard
                key={m._id}
                mentor={m}
                onClick={() => navigate(`/mentor/${m.handle || m.userId?._id}`)}
              />
            ))}
          </div>

          {pagination && totalPages > 1 && (
            <>
              <div className="mentor-pagination">
                <button
                  type="button"
                  className="mentor-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={boundedPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>

                {pageButtons.map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    className={`mentor-page-button ${pg === boundedPage ? 'active' : ''}`}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  className="mentor-page-button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={boundedPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mentor-page-summary">
                Showing {from}-{to} of {pagination.total} mentors
              </div>
            </>
          )}

          {pagination && page < pagination.totalPages && (
            <div className="mentor-pagination">
              <button
                type="button"
                className="mentor-search-button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Next page'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
