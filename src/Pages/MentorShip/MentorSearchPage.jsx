import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, Filter, ChevronDown, X, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

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

const MentorCard = ({ mentor, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background:'#fff', border:'1px solid #E8ECF4', borderRadius:'16px',
      padding:'20px', cursor:'pointer', transition:'all 0.2s',
    }}
    onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 24px rgba(79,70,229,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
  >
    {/* Avatar + badge */}
    <div style={{ display:'flex', gap:'14px', marginBottom:'14px' }}>
      <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', flexShrink:0, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'22px', fontWeight:800 }}>
        {mentor.profileImage||mentor.userId?.imageUrl
          ? <img src={mentor.profileImage||mentor.userId?.imageUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          : mentor.displayName?.[0]?.toUpperCase()}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <h3 style={{ margin:'0 0 2px', fontSize:'15px', fontWeight:700, color:'#1E293B' }}>{mentor.displayName}</h3>
        {mentor.handle && <div style={{ fontSize:'12px', color:'#94A3B8' }}>@{mentor.handle}</div>}
        {mentor.userId?.jobTitle && <div style={{ fontSize:'12px', color:'#64748B', marginTop:'2px' }}>{mentor.userId.jobTitle}</div>}
        {mentor.location?.city && <div style={{ fontSize:'12px', color:'#94A3B8', display:'flex', alignItems:'center', gap:'3px', marginTop:'2px' }}><MapPin size={10}/>{mentor.location.city}</div>}
      </div>
      {mentor.featured && <span style={{ fontSize:'10px', fontWeight:700, color:'#D97706', background:'#FEF3C7', borderRadius:'20px', padding:'2px 8px', height:'fit-content', whiteSpace:'nowrap' }}>⭐ Featured</span>}
    </div>

    {/* Expertise tags */}
    {mentor.expertise?.length > 0 && (
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
        {mentor.expertise.slice(0,3).map((t,i) => (
          <span key={i} style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{t}</span>
        ))}
        {mentor.expertise.length > 3 && <span style={{ fontSize:'11px', color:'#94A3B8' }}>+{mentor.expertise.length-3}</span>}
      </div>
    )}

    {/* Stats row */}
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #F1F5F9', paddingTop:'12px' }}>
      <div style={{ display:'flex', gap:'12px', fontSize:'12px', color:'#64748B' }}>
        {mentor.averageRating > 0 && (
          <span style={{ display:'flex', alignItems:'center', gap:'3px' }}>
            <Star size={11} fill="#F59E0B" color="#F59E0B"/> {mentor.averageRating.toFixed(1)} ({mentor.totalReviews})
          </span>
        )}
        {mentor.totalMentees > 0 && (
          <span style={{ display:'flex', alignItems:'center', gap:'3px' }}>
            <Users size={11}/> {mentor.totalMentees}
          </span>
        )}
      </div>
      <div style={{ textAlign:'right' }}>
        {mentor.startingPrice > 0 ? (
          <span style={{ fontSize:'14px', fontWeight:700, color:'#1E293B' }}>From ₹{mentor.startingPrice?.toLocaleString('en-IN')}</span>
        ) : (
          <span style={{ fontSize:'13px', fontWeight:700, color:'#059669' }}>Free available</span>
        )}
      </div>
    </div>
  </div>
);

export default function MentorSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [serviceType, setServiceType] = useState(searchParams.get('serviceType') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [showFilters, setShowFilters] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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
      const res = await axios.get(`${API_URL}/mentor/search`, { params });
      if (pg === 1) setMentors(res.data.mentors);
      else setMentors(prev => [...prev, ...res.data.mentors]);
      setPagination(res.data.pagination);
    } catch(e) {
      console.error('Failed to fetch mentors:', e);
    }
    setLoading(false);
  }, [q, domain, serviceType, minRating, maxPrice, sort]);

  useEffect(() => {
    setPage(1);
    fetchMentors(1);
    // Update URL
    const p = {};
    if (q) p.q = q;
    if (domain) p.domain = domain;
    if (serviceType) p.serviceType = serviceType;
    if (minRating) p.minRating = minRating;
    if (maxPrice) p.maxPrice = maxPrice;
    if (sort !== 'featured') p.sort = sort;
    setSearchParams(p);
  }, [q, domain, serviceType, minRating, maxPrice, sort]);

  const hasFilters = domain || serviceType || minRating || maxPrice;
  const clearFilters = () => { setDomain(''); setServiceType(''); setMinRating(''); setMaxPrice(''); };

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 16px', fontFamily:'Inter,sans-serif' }}>

      {/* Hero search */}
      <div style={{ background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius:'20px', padding:'40px 32px', marginBottom:'28px', textAlign:'center', color:'#fff' }}>
        <h1 style={{ margin:'0 0 8px', fontSize:'28px', fontWeight:800 }}>Find Your Perfect Mentor 🚀</h1>
        <p style={{ margin:'0 0 24px', opacity:0.85, fontSize:'15px' }}>Connect with industry experts for 1:1 sessions, resume reviews, mock interviews & more</p>
        <div style={{ background:'#fff', borderRadius:'14px', padding:'6px 6px 6px 16px', display:'flex', gap:'8px', maxWidth:'560px', margin:'0 auto' }}>
          <Search size={18} color="#94A3B8" style={{ flexShrink:0, alignSelf:'center' }}/>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, skill, domain…"
            style={{ flex:1, border:'none', outline:'none', fontSize:'15px', color:'#1E293B', background:'transparent' }}
          />
          <button onClick={()=>fetchMentors(1)} style={{ background:'#4F46E5', color:'#fff', border:'none', borderRadius:'10px', padding:'10px 20px', fontWeight:600, fontSize:'14px', cursor:'pointer' }}>
            Search
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <button onClick={()=>setShowFilters(!showFilters)} style={{ display:'flex', alignItems:'center', gap:'6px', background: showFilters?'#4F46E5':'#F1F5F9', color: showFilters?'#fff':'#475569', border:'none', borderRadius:'10px', padding:'8px 14px', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            <Filter size={14}/> Filters {hasFilters && <span style={{ background: showFilters?'rgba(255,255,255,0.3)':'#4F46E5', color:'#fff', borderRadius:'10px', padding:'1px 7px', fontSize:'11px' }}>{[domain,serviceType,minRating,maxPrice].filter(Boolean).length}</span>}
          </button>
          {hasFilters && <button onClick={clearFilters} style={{ display:'flex', alignItems:'center', gap:'4px', background:'none', border:'none', color:'#DC2626', fontSize:'13px', cursor:'pointer' }}><X size={13}/> Clear</button>}
          {pagination && <span style={{ fontSize:'13px', color:'#94A3B8' }}>{pagination.total} mentor{pagination.total!==1?'s':''} found</span>}
        </div>

        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'8px 12px', fontSize:'13px', color:'#475569', outline:'none', cursor:'pointer' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ background:'#FAFBFF', border:'1px solid #E8ECF4', borderRadius:'14px', padding:'20px', marginBottom:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
          {/* Domain */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748B', display:'block', marginBottom:'6px' }}>Domain</label>
            <select value={domain} onChange={e=>setDomain(e.target.value)} style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'8px 10px', fontSize:'13px', color:'#1E293B', outline:'none' }}>
              <option value="">All Domains</option>
              {DOMAINS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748B', display:'block', marginBottom:'6px' }}>Service Type</label>
            <select value={serviceType} onChange={e=>setServiceType(e.target.value)} style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'8px 10px', fontSize:'13px', color:'#1E293B', outline:'none' }}>
              {SERVICE_TYPES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748B', display:'block', marginBottom:'6px' }}>Min Rating</label>
            <select value={minRating} onChange={e=>setMinRating(e.target.value)} style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'8px 10px', fontSize:'13px', color:'#1E293B', outline:'none' }}>
              <option value="">Any Rating</option>
              <option value="4">⭐ 4+</option>
              <option value="3">⭐ 3+</option>
              <option value="2">⭐ 2+</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748B', display:'block', marginBottom:'6px' }}>Max Price</label>
            <input type="number" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="e.g. 5000" style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'8px 10px', fontSize:'13px', color:'#1E293B', outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
          {domain && <span style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>📂 {domain} <button onClick={()=>setDomain('')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#4F46E5', lineHeight:1 }}>×</button></span>}
          {serviceType && <span style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>🎯 {SERVICE_TYPES.find(s=>s.value===serviceType)?.label} <button onClick={()=>setServiceType('')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#4F46E5', lineHeight:1 }}>×</button></span>}
          {minRating && <span style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>⭐ {minRating}+ stars <button onClick={()=>setMinRating('')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#4F46E5', lineHeight:1 }}>×</button></span>}
          {maxPrice && <span style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>💰 Under ₹{maxPrice} <button onClick={()=>setMaxPrice('')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#4F46E5', lineHeight:1 }}>×</button></span>}
        </div>
      )}

      {/* Grid */}
      {loading && mentors.length === 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ background:'#F8FAFC', borderRadius:'16px', height:'200px', animation:'pulse 1.5s infinite' }}/>
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : mentors.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px', color:'#94A3B8' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔍</div>
          <h3 style={{ color:'#1E293B', marginBottom:'6px' }}>No mentors found</h3>
          <p style={{ fontSize:'14px' }}>Try adjusting your search or filters.</p>
          {hasFilters && <button onClick={clearFilters} style={{ marginTop:'12px', background:'#4F46E5', color:'#fff', border:'none', borderRadius:'10px', padding:'10px 24px', cursor:'pointer', fontWeight:600 }}>Clear all filters</button>}
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
            {mentors.map(m => (
              <MentorCard
                key={m._id}
                mentor={m}
                onClick={() => navigate(`/mentor/${m.handle || m.userId?._id}`)}
              />
            ))}
          </div>

          {/* Load more */}
          {pagination && page < pagination.totalPages && (
            <div style={{ textAlign:'center', marginTop:'28px' }}>
              <button
                onClick={() => { const next = page+1; setPage(next); fetchMentors(next); }}
                disabled={loading}
                style={{ background:'#4F46E5', color:'#fff', border:'none', borderRadius:'12px', padding:'12px 32px', fontSize:'14px', fontWeight:600, cursor:'pointer', opacity: loading?0.7:1 }}
              >
                {loading ? 'Loading…' : `Load More (${pagination.total - mentors.length} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
