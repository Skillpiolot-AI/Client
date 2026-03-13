import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Users, Clock, Video, MessageSquare, FileText,
  HelpCircle, Gift, BookOpen, Calendar, Zap, Share2, ArrowLeft,
  ChevronDown, ChevronUp, CheckCircle, ExternalLink, Tag,
  Linkedin, Github, Twitter, Globe
} from 'lucide-react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../../AuthContext';
import SendDMModal from './SendDMModal';
import BookingModal from './Bookings/BookingModal';

const API_URL = config.API_BASE_URL;



const SERVICE_CONFIG = {
  one_on_one:       { icon: '🎥', label: '1:1 Session',     color: '#4F46E5', bg: '#EEF2FF' },
  quick_chat:       { icon: '⚡', label: 'Quick Chat',      color: '#0891B2', bg: '#E0F2FE' },
  mock_interview:   { icon: '🎯', label: 'Mock Interview',   color: '#7C3AED', bg: '#F5F3FF' },
  career_guidance:  { icon: '🧭', label: 'Career Guidance', color: '#D97706', bg: '#FEF3C7' },
  discovery_call:   { icon: '🌱', label: 'Discovery Call',  color: '#059669', bg: '#D1FAE5' },
  priority_dm:      { icon: '💬', label: 'Priority DM',     color: '#DC2626', bg: '#FEE2E2' },
  resume_review:    { icon: '📄', label: 'Resume Review',   color: '#7C3AED', bg: '#F5F3FF' },
  portfolio_review: { icon: '🖼️', label: 'Portfolio Review',color: '#0891B2', bg: '#E0F2FE' },
  ama:              { icon: '🙋', label: 'Ask Me Anything', color: '#D97706', bg: '#FEF3C7' },
  referral:         { icon: '🤝', label: 'Referral',        color: '#059669', bg: '#D1FAE5' },
  course:           { icon: '📚', label: 'Course',          color: '#4F46E5', bg: '#EEF2FF' },
  workshop:         { icon: '👥', label: 'Workshop',        color: '#DC2626', bg: '#FEE2E2' },
  coaching_series:  { icon: '🗓️', label: 'Coaching Series', color: '#7C3AED', bg: '#F5F3FF' },
  webinar:          { icon: '🖥️', label: 'Webinar',         color: '#0891B2', bg: '#E0F2FE' },
  custom:           { icon: '✨', label: 'Custom',          color: '#64748B', bg: '#F1F5F9' },
};

const ASYNC_TYPES = ['priority_dm','resume_review','portfolio_review','ama','referral','course'];

const ServiceCard = ({ service, onBook }) => {
  const cfg = SERVICE_CONFIG[service.serviceType] || SERVICE_CONFIG.custom;
  const [exp, setExp] = useState(false);
  return (
    <div style={{ border:'1px solid #E8ECF4', borderRadius:'16px', padding:'20px', background:'#fff', marginBottom:'12px' }}>
      <div style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
          {service.emoji || cfg.icon}
        </div>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:'11px', fontWeight:700, color:cfg.color, background:cfg.bg, borderRadius:'20px', padding:'2px 10px', textTransform:'uppercase' }}>{cfg.label}</span>
          <h3 style={{ margin:'6px 0 4px', fontSize:'15px', fontWeight:700, color:'#1E293B' }}>{service.title}</h3>
          {service.description && (
            <p style={{ fontSize:'13px', color:'#64748B', margin:'0 0 6px' }}>
              {exp ? service.description : service.description.slice(0,90) + (service.description.length>90?'…':'')}
              {service.description.length>90 && <button onClick={e=>{e.stopPropagation();setExp(!exp)}} style={{background:'none',border:'none',color:'#4F46E5',cursor:'pointer',padding:0,fontSize:'13px'}}> {exp?'Less':'More'}</button>}
            </p>
          )}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', fontSize:'12px', color:'#94A3B8' }}>
            {!ASYNC_TYPES.includes(service.serviceType) && service.duration && <span>⏱ {service.duration} min</span>}
            {ASYNC_TYPES.includes(service.serviceType) && service.responseTime && <span>⏱ {service.responseTime}</span>}
            {service.sessionCount>1 && <span>📦 {service.sessionCount} sessions</span>}
            {service.capacity && <span>👥 Max {service.capacity}</span>}
          </div>
          {exp && service.includes?.length>0 && (
            <ul style={{ margin:'8px 0 0', padding:0, listStyle:'none' }}>
              {service.includes.map((item,i)=>(
                <li key={i} style={{ fontSize:'13px', color:'#475569', display:'flex', gap:'6px', marginBottom:'3px' }}>✅ {item}</li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontSize:'20px', fontWeight:800, color:'#1E293B' }}>
            {service.isFree||service.price===0 ? <span style={{color:'#059669'}}>Free</span> : `₹${service.price?.toLocaleString('en-IN')}`}
          </div>
          {service.serviceType==='priority_dm' && <div style={{fontSize:'11px',color:'#94A3B8'}}>/month</div>}
          <button onClick={()=>onBook(service)} style={{ marginTop:'8px', background:service.isFree?'#059669':'#4F46E5', color:'#fff', border:'none', borderRadius:'10px', padding:'8px 16px', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            {service.serviceType==='course'?'Enroll':service.serviceType==='priority_dm'?'Subscribe':service.isFree?'Book Free':'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div style={{ background:'#FAFBFF', border:'1px solid #E8ECF4', borderRadius:'12px', padding:'14px', marginBottom:'10px' }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
      <div style={{ display:'flex', gap:'3px' }}>
        {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:'14px'}}>{s<=review.rating?'⭐':'☆'}</span>)}
      </div>
      <span style={{ fontSize:'12px', color:'#94A3B8' }}>{new Date(review.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</span>
    </div>
    {review.comment && <p style={{ fontSize:'13px', color:'#475569', margin:0, lineHeight:1.6 }}>{review.comment}</p>}
  </div>
);

export default function PublicMentorProfile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [bookingService, setBookingService] = useState(null);
  const [dmService, setDmService] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {

    const p = new URLSearchParams(window.location.search);
    const c = p.get('coupon_code');
    if (c) setCouponCode(c.toUpperCase());
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/mentor/profile/${handle}`)
      .then(r => { setData(r.data.profile); setLoading(false); })
      .catch(e => { setError(e.response?.data?.error||'Not found'); setLoading(false); });
  }, [handle]);

  const handleValidateCoupon = async (service) => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const token = localStorage.getItem('token');
      const r = await axios.post(`${API_URL}/coupons/validate`,
        { code: couponCode, mentorId: data.userId._id, serviceId: service._id },
        { headers: { Authorization:`Bearer ${token}` } }
      );
      setCouponResult(r.data);
    } catch(e) {
      setCouponResult({ valid:false, reason: e.response?.data?.error||'Invalid coupon' });
    }
    setCouponLoading(false);
  };

  const handleConfirmBooking = async (bookingData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to book a session');
        navigate('/login', { state: { from: `/mentor/${handle}` } });
        return;
      }
      await axios.post(`${API_URL}/bookings/book`, bookingData, { headers: { Authorization: `Bearer ${token}` } });
      alert('🎉 Session booked successfully! Check your email for the meeting link.');
      setIsBookingModalOpen(false);
      setBookingService(null);
      setCouponResult(null);
      setCouponCode('');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to book session');
    }
    setIsSubmitting(false);
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'60vh'}}><div style={{width:'36px',height:'36px',border:'3px solid #4F46E5',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (error) return <div style={{textAlign:'center',padding:'80px 20px'}}><h2>Mentor not found</h2><p style={{color:'#64748B'}}>{error}</p><button onClick={()=>navigate('/mentors')} style={{marginTop:'16px',background:'#4F46E5',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 24px',cursor:'pointer',fontWeight:600}}>Browse Mentors</button></div>;


  const profile = data;
  const mentor = profile.userId;
  const services = profile.services || [];
  const grouped = profile.groupedServices || {};
  const reviews = profile.reviews || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0,4);

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'24px 16px', fontFamily:'Inter,sans-serif' }}>
      <button onClick={()=>navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'#64748B', fontSize:'14px', cursor:'pointer', marginBottom:'20px', padding:0 }}>
        <ArrowLeft size={16}/> Back
      </button>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius:'20px', padding:'32px', color:'#fff', marginBottom:'24px' }}>
        <div style={{ display:'flex', gap:'20px', alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ width:'88px', height:'88px', borderRadius:'50%', border:'3px solid rgba(255,255,255,0.4)', overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:800 }}>
            {(profile.profileImage||mentor?.imageUrl) ? <img src={profile.profileImage||mentor.imageUrl} alt={profile.displayName} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : profile.displayName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ margin:'0 0 2px', fontSize:'24px', fontWeight:800 }}>{profile.displayName}</h1>
            {profile.handle && <div style={{ fontSize:'13px', opacity:0.7 }}>@{profile.handle}</div>}
            {profile.tagline && <p style={{ margin:'8px 0 0', fontSize:'14px', opacity:0.9 }}>{profile.tagline}</p>}
            {mentor?.jobTitle && <p style={{ margin:'6px 0 0', fontSize:'13px', opacity:0.8 }}>{mentor.jobTitle}{mentor.company?` @ ${mentor.company}`:''}</p>}
            {profile.location?.city && <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'6px', fontSize:'12px', opacity:0.7 }}><MapPin size={11}/> {profile.location.city}{profile.location.country?`, ${profile.location.country}`:''}</div>}
            {profile.expertise?.length>0 && (
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'10px' }}>
                {profile.expertise.map((t,i)=><span key={i} style={{ background:'rgba(255,255,255,0.2)', borderRadius:'20px', padding:'3px 10px', fontSize:'12px', fontWeight:600 }}>{t}</span>)}
              </div>
            )}
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <button onClick={()=>{navigator.clipboard.writeText(window.location.href);}} style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'10px', padding:'7px 14px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', gap:'5px' }}>
              <Share2 size={13}/> Share
            </button>
            <div style={{ display:'flex', gap:'16px', marginTop:'14px', justifyContent:'flex-end' }}>
              {profile.totalMentees>0 && <div style={{textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:800}}>{profile.totalMentees}</div><div style={{fontSize:'11px',opacity:0.7}}>Mentees</div></div>}
              {profile.averageRating>0 && <div style={{textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:800}}>⭐{profile.averageRating.toFixed(1)}</div><div style={{fontSize:'11px',opacity:0.7}}>{profile.totalReviews} reviews</div></div>}
            </div>
          </div>
        </div>
        {/* Social links */}
        {profile.socialLinks && Object.values(profile.socialLinks).some(v=>v) && (
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'16px' }}>
            {profile.socialLinks.linkedIn && <a href={profile.socialLinks.linkedIn} target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.8)', textDecoration:'none', background:'rgba(255,255,255,0.15)', borderRadius:'8px', padding:'4px 12px', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}><Linkedin size={12}/> LinkedIn</a>}
            {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.8)', textDecoration:'none', background:'rgba(255,255,255,0.15)', borderRadius:'8px', padding:'4px 12px', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}><Github size={12}/> GitHub</a>}
            {profile.socialLinks.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.8)', textDecoration:'none', background:'rgba(255,255,255,0.15)', borderRadius:'8px', padding:'4px 12px', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}><Twitter size={12}/> Twitter</a>}
            {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.8)', textDecoration:'none', background:'rgba(255,255,255,0.15)', borderRadius:'8px', padding:'4px 12px', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}><Globe size={12}/> Portfolio</a>}
          </div>
        )}
      </div>

      {/* Coupon URL auto-detected banner */}
      {couponCode && (
        <div style={{ background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
          <Tag size={15} color="#059669"/>
          <span style={{ fontSize:'14px', color:'#065F46', fontWeight:600 }}>🎟️ Coupon <strong>{couponCode}</strong> will auto-apply at checkout!</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'2px solid #E8ECF4', marginBottom:'24px' }}>
        {[['services','Services'],['reviews','Reviews'],['about','About']].map(([k,l])=>(
          <button key={k} onClick={()=>setActiveTab(k)} style={{ background:'none', border:'none', borderBottom: activeTab===k?'2px solid #4F46E5':'2px solid transparent', marginBottom:'-2px', padding:'10px 20px', fontSize:'14px', fontWeight:600, color:activeTab===k?'#4F46E5':'#64748B', cursor:'pointer' }}>
            {l}{k==='reviews'&&reviews.length>0&&<span style={{ marginLeft:'6px', background:'#EEF2FF', color:'#4F46E5', borderRadius:'10px', padding:'1px 7px', fontSize:'12px' }}>{reviews.length}</span>}
          </button>
        ))}
      </div>

      {/* Services Tab */}
      {activeTab==='services' && (
        <div>
          {services.length===0 ? <p style={{textAlign:'center',color:'#94A3B8',padding:'40px'}}>No services listed yet.</p> : (
            <>
              {grouped.live?.length>0 && <><h2 style={{fontSize:'13px',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'12px'}}>📅 Live Sessions</h2>{grouped.live.map(s=><ServiceCard key={s._id} service={s} onBook={s.serviceType==='priority_dm'?setDmService:setBookingService}/>)}</>}
              {grouped.async?.length>0 && <><h2 style={{fontSize:'13px',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.8px',margin:'20px 0 12px'}}>💬 Async / On-Demand</h2>{grouped.async.map(s=><ServiceCard key={s._id} service={s} onBook={s.serviceType==='priority_dm'?setDmService:setBookingService}/>)}</>}
              {grouped.group?.length>0 && <><h2 style={{fontSize:'13px',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.8px',margin:'20px 0 12px'}}>👥 Group Events</h2>{grouped.group.map(s=><ServiceCard key={s._id} service={s} onBook={s.serviceType==='priority_dm'?setDmService:setBookingService}/>)}</>}
              {grouped.products?.length>0 && <><h2 style={{fontSize:'13px',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.8px',margin:'20px 0 12px'}}>🎓 Digital Products</h2>{grouped.products.map(s=><ServiceCard key={s._id} service={s} onBook={s.serviceType==='priority_dm'?setDmService:setBookingService}/>)}</>}
            </>
          )}
        </div>
      )}


      {/* Reviews Tab */}
      {activeTab==='reviews' && (
        <div>
          {reviews.length===0 ? <p style={{textAlign:'center',color:'#94A3B8',padding:'40px'}}>No reviews yet.</p> : (
            <>
              <div style={{ background:'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius:'16px', padding:'24px', textAlign:'center', marginBottom:'20px' }}>
                <div style={{ fontSize:'48px', fontWeight:800, color:'#4F46E5' }}>{profile.averageRating?.toFixed(1)}</div>
                <div style={{ margin:'6px 0', fontSize:'20px' }}>{[1,2,3,4,5].map(s=>s<=Math.round(profile.averageRating)?'⭐':'☆').join('')}</div>
                <div style={{ color:'#64748B', fontSize:'14px' }}>{profile.totalReviews} reviews</div>
              </div>
              {visibleReviews.map((r,i)=><ReviewCard key={i} review={r}/>)}
              {reviews.length>4&&<button onClick={()=>setShowAllReviews(!showAllReviews)} style={{ display:'flex', alignItems:'center', gap:'6px', margin:'12px auto 0', background:'none', border:'1px solid #E8ECF4', borderRadius:'10px', padding:'8px 18px', color:'#4F46E5', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>
                {showAllReviews?<><ChevronUp size={15}/> Show less</>:<><ChevronDown size={15}/> All {reviews.length} reviews</>}
              </button>}
            </>
          )}
        </div>
      )}

      {/* About Tab */}
      {activeTab==='about' && (
        <div>
          {profile.customSections?.filter(s=>s.isVisible).sort((a,b)=>a.sortOrder-b.sortOrder).map((sec,i)=>(
            <div key={i} style={{ marginBottom:'24px' }}>
              {sec.title && <h3 style={{ fontSize:'17px', fontWeight:700, color:'#1E293B', marginBottom:'8px' }}>{sec.title}</h3>}
              {sec.content && <p style={{ fontSize:'14px', color:'#475569', lineHeight:'1.8', whiteSpace:'pre-wrap', marginBottom:'10px' }}>{sec.content}</p>}
              {sec.images?.length>0 && <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>{sec.images.map((img,j)=><img key={j} src={img} alt="" onClick={()=>setLightboxImg(img)} style={{ width:'150px', height:'105px', objectFit:'cover', borderRadius:'10px', cursor:'pointer', border:'1px solid #E2E8F0' }}/>)}</div>}
            </div>
          ))}
          {profile.bio && <>
            <h2 style={{ fontSize:'18px', fontWeight:700, color:'#1E293B', marginBottom:'10px' }}>About Me</h2>
            <p style={{ fontSize:'14px', color:'#475569', lineHeight:'1.8', whiteSpace:'pre-wrap' }}>{profile.bio}</p>
          </>}
          {profile.education?.length>0 && <><h3 style={{fontSize:'16px',fontWeight:700,color:'#1E293B',margin:'20px 0 8px'}}>Education</h3>{profile.education.map((e,i)=><p key={i} style={{fontSize:'14px',color:'#475569'}}><strong>{e.degree}</strong> in {e.field} — {e.institution} {e.year&&`(${e.year})`}</p>)}</>}
          {profile.certifications?.length>0 && <><h3 style={{fontSize:'16px',fontWeight:700,color:'#1E293B',margin:'20px 0 8px'}}>Certifications</h3>{profile.certifications.map((c,i)=><div key={i} style={{fontSize:'14px',color:'#475569',marginBottom:'4px',display:'flex',alignItems:'center',gap:'6px'}}>✅ {c.name} — {c.issuer}{c.credentialUrl&&<a href={c.credentialUrl} target="_blank" rel="noreferrer"><ExternalLink size={11} color="#4F46E5"/></a>}</div>)}</>}
          {profile.referralsInTopCompanies&&profile.topCompanies?.length>0&&(
            <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'12px', padding:'16px', marginTop:'20px' }}>
              <p style={{ fontWeight:700, color:'#C2410C', marginBottom:'8px' }}>🤝 Referrals Available to:</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>{profile.topCompanies.map((c,i)=><span key={i} style={{background:'#FFEDD5',borderRadius:'8px',padding:'4px 12px',fontSize:'13px',fontWeight:600,color:'#9A3412'}}>{c}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div onClick={()=>setLightboxImg(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <img src={lightboxImg} alt="full" style={{ maxWidth:'90vw', maxHeight:'85vh', borderRadius:'12px' }}/>
        </div>
      )}

      {/* Booking Modal */}
      {bookingService && (
        <div onClick={()=>{setBookingService(null);setCouponResult(null);}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:'16px' }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:'20px', padding:'28px', maxWidth:'480px', width:'100%' }}>
            <h2 style={{ margin:'0 0 4px', fontSize:'18px', fontWeight:800, color:'#1E293B' }}>{bookingService.title}</h2>
            <p style={{ fontSize:'13px', color:'#64748B', margin:'0 0 20px' }}>with {profile.displayName}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div>
                <div style={{ fontSize:'28px', fontWeight:800, color:'#1E293B' }}>
                  {couponResult?.valid
                    ? <>₹{couponResult.finalPrice} <span style={{fontSize:'15px',textDecoration:'line-through',color:'#94A3B8'}}>₹{bookingService.price}</span></>
                    : bookingService.isFree ? <span style={{color:'#059669'}}>Free</span> : `₹${bookingService.price?.toLocaleString('en-IN')}`}
                </div>
                {couponResult?.valid && <div style={{fontSize:'13px',color:'#059669',fontWeight:600}}>✅ Saved ₹{couponResult.discountAmount}!</div>}
                {couponResult&&!couponResult.valid && <div style={{fontSize:'13px',color:'#DC2626'}}>❌ {couponResult.reason}</div>}
              </div>
              {!ASYNC_TYPES.includes(bookingService.serviceType) && <span style={{fontSize:'13px',color:'#64748B'}}>⏱ {bookingService.duration} min</span>}
            </div>
            {!bookingService.isFree && (
              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'6px' }}>🎟️ Have a coupon?</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input value={couponCode} onChange={e=>{setCouponCode(e.target.value.toUpperCase());setCouponResult(null);}} placeholder="SAVE15" style={{ flex:1, border:'1.5px solid #E2E8F0', borderRadius:'10px', padding:'9px 12px', fontSize:'14px', outline:'none' }}/>
                  <button onClick={()=>handleValidateCoupon(bookingService)} disabled={couponLoading||!couponCode.trim()} style={{ background:'#4F46E5', color:'#fff', border:'none', borderRadius:'10px', padding:'9px 16px', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
                    {couponLoading?'…':'Apply'}
                  </button>
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={()=>{
                if (!user) { navigate('/login', { state: { from: `/mentor/${handle}` } }); return; }
                setIsBookingModalOpen(true);
              }} style={{ flex:1, background:'#4F46E5', color:'#fff', border:'none', borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:700, cursor:'pointer' }}>
                {bookingService.isFree ? 'Book Free Session' : 'Proceed to Book'}
              </button>
              <button onClick={()=>{setBookingService(null);setCouponResult(null);}} style={{ background:'#F1F5F9', color:'#64748B', border:'none', borderRadius:'12px', padding:'14px 16px', cursor:'pointer' }}>

                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Priority DM Send Modal */}
      {dmService && (
        <SendDMModal
          mentor={mentor}
          service={dmService}
          onClose={()=>setDmService(null)}
        />
      )}

      {/* Date/Time Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        mentor={mentor}
        bookingService={bookingService}
        couponCode={couponResult?.valid ? couponCode : null}
        couponResult={couponResult}
        onConfirmBooking={handleConfirmBooking}
        isBooking={isSubmitting}
      />
    </div>
  );
}
