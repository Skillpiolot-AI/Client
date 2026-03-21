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
    <div className="group bg-white rounded-[2rem] p-6 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(31,27,24,0.06)] hover:-translate-y-1 flex flex-col cursor-pointer border border-transparent hover:border-slate-100" onClick={onClick}>
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#eae1dc] overflow-hidden">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-[#1d4ed8] to-[#0ea5e9] text-white">
                {title?.[0]?.toUpperCase() || 'M'}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#0f766e] text-white p-1 rounded-lg">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-amber-500 mb-1">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span className="text-sm font-bold">{mentor.averageRating > 0 ? mentor.averageRating.toFixed(1) : 'New'}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{mentor.totalReviews || 0} Reviews</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold font-headline text-[#1d2b3e] mb-1">{title}</h3>
        <p className="text-sm font-medium text-slate-500">{headline}</p>
      </div>

      <p className="text-sm text-slate-600 font-body mb-6 leading-relaxed flex-1">
        {mentor.about || mentor.description || 'Dedicated mentor assisting career acceleration and technical pathways guidance setups frameworks.'}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-medium">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100/60">
        <div className="text-[#1d2b3e] text-sm font-bold">
          {mentor.startingPrice > 0
            ? `${currencySymbol}${convertPrice(mentor.startingPrice, mentor.preferredCurrency || 'INR')?.toLocaleString()}`
            : 'Free avail.'}
        </div>
        <div className="flex gap-2">
          <button className="py-2 px-4 rounded-xl border border-slate-100 text-[#1d2b3e] font-bold text-xs hover:bg-slate-50 transition-colors">
            Profile
          </button>
          <button className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#0f766e] to-[#134e4a] text-white font-bold text-xs shadow-lg shadow-teal-900/10 active:scale-95 transition-transform">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MentorSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [serviceType, setServiceType] = useState(
    searchParams.get('serviceType') ? searchParams.get('serviceType').split(',').filter(Boolean) : []
  );
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '10000');
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [domainSearch, setDomainSearch] = useState('');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const initialPage = Number(searchParams.get('page') || 1);
  const [page, setPage] = useState(Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);
  const [showFilters, setShowFilters] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const handleServiceTypeChange = (value) => {
    setServiceType(prev => 
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const fetchMentors = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { sort, page: pg, limit: 12 };
      if (q) params.q = q;
      if (domain) params.domain = domain;
      if (serviceType.length > 0) params.serviceType = serviceType.join(',');
      if (minRating) params.minRating = minRating;
      if (isFreeOnly) {
        params.maxPrice = "0";
      } else if (maxPrice && maxPrice !== "10000") {
        params.maxPrice = maxPrice;
      }
      if (language) params.language = language;
      const res = await axios.get(`${API_URL}/mentor/search`, { params });
      setMentors(res.data.mentors || []);
      setPagination(res.data.pagination);
      if (res.data.availableDomains) setAvailableDomains(res.data.availableDomains);
    } catch(e) {
      console.error('Failed to fetch mentors:', e);
    }
    setLoading(false);
  }, [q, domain, serviceType, minRating, maxPrice, isFreeOnly, language, sort]);

  useEffect(() => {
    setPage(1);
  }, [q, domain, serviceType, minRating, maxPrice, isFreeOnly, language, sort]);

  useEffect(() => {
    fetchMentors(page);
    // Update URL
    const p = {};
    if (q) p.q = q;
    if (domain) p.domain = domain;
    if (serviceType.length > 0) p.serviceType = serviceType.join(',');
    if (minRating) p.minRating = minRating;
    if (isFreeOnly) p.isFreeOnly = 'true';
    else if (maxPrice && maxPrice !== '10000') p.maxPrice = maxPrice;
    if (language) p.language = language;
    if (sort !== 'featured') p.sort = sort;
    if (page > 1) p.page = String(page);
    setSearchParams(p);
  }, [fetchMentors, page, q, domain, serviceType, minRating, maxPrice, isFreeOnly, language, sort, setSearchParams]);

  const hasFilters = domain || serviceType.length > 0 || minRating || (maxPrice && maxPrice !== '10000') || isFreeOnly || language;
  const activeFilterCount = [domain, minRating, language].filter(Boolean).length + serviceType.length + (isFreeOnly ? 1 : 0) + (maxPrice !== '10000' && maxPrice ? 1 : 0);
  const clearFilters = () => {
    setDomain('');
    setServiceType([]);
    setMinRating('');
    setMaxPrice('10000');
    setIsFreeOnly(false);
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
    <div className="flex min-h-screen bg-[#fff8f5] text-[#1f1b18] pt-12">
      {/* 📱 Mobile Filter Button (Float) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="p-4 rounded-full bg-[#1d2b3e] text-white shadow-xl flex items-center gap-2 scale-95 active:scale-90 transition-transform"
        >
          <Filter size={20} />
          <span className="text-sm font-bold">Filters</span>
          {hasFilters && <span className="bg-[#0f766e] text-white text-[10px] rounded-full px-1.5 py-0.5">{activeFilterCount}</span>}
        </button>
      </div>

      {/* 📱 Mobile Drawer Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 w-80 h-full bg-[#fff8f5] p-6 overflow-y-auto space-y-6 flex flex-col shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center border-b border-[#eae1dc] pb-4">
               <h2 className="font-headline text-lg font-bold text-[#1d2b3e]">Filters</h2>
               <button onClick={() => setShowFilters(false)} className="text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="space-y-6 flex-1">
              {/* Domain (Dynamic SELECT overlay) */}
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Domain</label>
                <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full text-sm rounded-xl bg-white border border-[#c5c6cd] p-2.5">
                  <option value="">All Domains</option>
                  {(availableDomains.length > 0 ? availableDomains : DOMAINS).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Service Type (Checkboxes) */}
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Service Type</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-white p-2.5 rounded-xl border border-[#c5c6cd]">
                  {SERVICE_TYPES.filter(s => s.value).map(s => (
                    <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={serviceType.includes(s.value)}
                        onChange={() => handleServiceTypeChange(s.value)}
                        className="rounded border-[#c5c6cd] text-[#1d2b3e] focus:ring-[#1d2b3e]/10"
                      />
                      <span className="text-xs text-slate-700">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Rating Buttons */}
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Min Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[4, 3, 2].map(r => (
                    <button 
                      key={r}
                      onClick={() => setMinRating(minRating === String(r) ? '' : String(r))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        minRating === String(r) ? 'bg-[#1d2b3e] text-white' : 'bg-white border border-[#c5c6cd] text-slate-600'
                      }`}
                    >
                      ⭐ {r}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing setup with Range & Checkbox */}
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Pricing</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="mobile_isFree" 
                      checked={isFreeOnly}
                      onChange={e => setIsFreeOnly(e.target.checked)}
                      className="rounded border-[#c5c6cd] text-[#1d2b3e] focus:ring-[#1d2b3e]/10"
                    />
                    <label htmlFor="mobile_isFree" className="text-xs font-semibold text-slate-700">Free available only</label>
                  </div>
                  
                  {!isFreeOnly && (
                    <div className="space-y-1">
                      <input 
                        type="range" 
                        min="0" 
                        max="10000" 
                        step="500" 
                        value={maxPrice || '10000'} 
                        onChange={e => setMaxPrice(e.target.value)} 
                        className="w-full accent-[#1d2b3e]" 
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>Free</span>
                        <span>Max: {maxPrice === '10000' ? 'Any' : `₹${maxPrice}`}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button onClick={clearFilters} className="w-full py-3 rounded-xl border border-[#c5c6cd] text-[#1d2b3e] font-bold text-sm bg-white hover:bg-slate-50">
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ Desktop Sidebar Filters */}
      <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-3rem)] sticky top-12 bg-[#fbf2ed] p-6 gap-6 overflow-y-auto border-r border-[#eae1dc]/40">
        <div className="space-y-1">
          <h2 className="font-headline text-lg font-bold text-[#334155]">Advanced Filters</h2>
          <p className="font-body text-xs text-slate-500">Refine your mentorship search</p>
        </div>

        {/* Dynamic Domain List supporting Search */}
        <div className="space-y-4 border-b border-[#eae1dc]/50 pb-4">
          <h3 className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Domain</h3>
          <input 
            type="text" 
            placeholder="Search domains..." 
            value={domainSearch}
            onChange={e => setDomainSearch(e.target.value)}
            className="w-full text-xs rounded-lg bg-white border border-[#c5c6cd] px-3 py-2 focus:ring-[#1d2b3e]/10 mb-2"
          />
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            <button 
              onClick={() => setDomain('')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                !domain ? 'bg-[#1d2b3e] text-white shadow-sm' : 'bg-[#eae1dc] text-[#342f2d] hover:bg-white border border-transparent hover:border-slate-200'
              }`}
            >
              All
            </button>
            {(availableDomains.length > 0 ? availableDomains : DOMAINS)
              .filter(d => d.toLowerCase().includes(domainSearch.toLowerCase()))
              .map(d => (
              <button 
                key={d}
                onClick={() => setDomain(d)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  domain === d ? 'bg-[#1d2b3e] text-white shadow-sm' : 'bg-[#eae1dc] text-[#342f2d] hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Rating selection style explicit clickers updates bypassing checks systems */}
        <div className="space-y-3">
          <h3 className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c]">Minimum Rating</h3>
          <div className="flex flex-wrap gap-2">
            {[4, 3, 2].map(r => (
              <button 
                key={r}
                onClick={() => setMinRating(minRating === String(r) ? '' : String(r))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  minRating === String(r) ? 'bg-[#1d2b3e] text-white' : 'bg-white border border-[#c5c6cd] text-slate-600 hover:bg-slate-50'
                }`}
              >
                ⭐ {r}+
              </button>
            ))}
          </div>
        </div>

        {/* Service Type Checkbox lists */}
        <div className="space-y-3">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c] block">Service Type</label>
          <div className="space-y-2 max-h-40 overflow-y-auto bg-white p-2.5 rounded-xl border border-[#c5c6cd]">
            {SERVICE_TYPES.filter(s => s.value).map(s => (
              <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={serviceType.includes(s.value)}
                  onChange={() => handleServiceTypeChange(s.value)}
                  className="rounded border-[#c5c6cd] text-[#1d2b3e] focus:ring-[#1d2b3e]/10"
                />
                <span className="text-xs text-slate-700 font-medium">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pricing Range Slider and Free checkbox loads setups sidebars */}
        <div className="space-y-3">
          <label className="font-label text-xs font-bold uppercase tracking-widest text-[#44474c] block">Pricing</label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isFree" 
                checked={isFreeOnly}
                onChange={e => setIsFreeOnly(e.target.checked)}
                className="rounded border-[#c5c6cd] text-[#1d2b3e] focus:ring-[#1d2b3e]/10"
              />
              <label htmlFor="isFree" className="text-xs font-bold text-slate-700">Free available only</label>
            </div>
            
            {!isFreeOnly && (
              <div className="space-y-1">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="500" 
                  value={maxPrice || '10000'} 
                  onChange={e => setMaxPrice(e.target.value)} 
                  className="w-full accent-[#1d2b3e]" 
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>Free</span>
                  <span>Max: {maxPrice === '10000' ? 'Any' : `₹${maxPrice}`}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={clearFilters} className="mt-auto py-2.5 rounded-xl border border-[#c5c6cd] text-[#1d2b3e] font-bold text-xs bg-white hover:bg-slate-50 transition-colors">
          Clear Filters
        </button>
      </aside>

      {/* 🖥️ Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-extrabold font-headline tracking-tight text-[#1d2b3e]">Find your guide.</h1>
              <p className="text-slate-500 font-body max-w-md">Connect with industry leaders for personalized career acceleration and technical mastery.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d2b3e] transition-colors">
                <Search size={18} />
              </span>
              <input 
                className="w-full pl-12 pr-4 py-4 bg-[#eae1dc] border-none rounded-2xl focus:ring-2 focus:ring-[#1d2b3e]/10 focus:bg-white transition-all font-body text-sm placeholder:text-slate-400 text-[#1f1b18]" 
                placeholder="Search by name, role, or company..." 
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && mentors.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-[#1d2b3e] font-bold text-lg animate-pulse">Loading mentors...</div>
        ) : mentors.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center text-slate-500 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-[#1d2b3e] mb-2">No mentors found</h3>
            <p className="text-sm">Try adjusting your search query or filters to broaden results.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {mentors.map(m => (
                <MentorCard
                  key={m._id}
                  mentor={m}
                  onClick={() => navigate(`/mentor/${m.handle || m.userId?._id}`)}
                />
              ))}
            </div>

            {pagination && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={boundedPage === 1}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#1d2b3e] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {pageButtons.map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setPage(pg)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      pg === boundedPage ? 'bg-[#1d2b3e] text-white shadow-md' : 'bg-white border border-slate-200 text-[#1d2b3e] hover:bg-slate-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={boundedPage === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#1d2b3e] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
