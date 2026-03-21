import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, MapPin, Users, Clock, Video, MessageSquare, FileText,
  HelpCircle, Gift, BookOpen, Calendar, Zap, Share2, ArrowLeft,
  ChevronDown, ChevronUp, CheckCircle, ExternalLink, Tag,
  Linkedin, Github, Twitter, Globe, TrendingUp, Brain, Award, Compass
} from 'lucide-react';
import './MentorFlow.css';
import axios from 'axios';
import { useCurrency } from '../../CurrencyContext';
import config from '../../config';
import { useAuth } from '../../AuthContext';
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

const ServiceCard = ({ service, onBook, preferredCurrency }) => {
  const cfg = SERVICE_CONFIG[service.serviceType] || SERVICE_CONFIG.custom;
  const { convertPrice, currencySymbol } = useCurrency();
  const IconComponent = {
    one_on_one: Video,
    quick_chat: Zap,
    mock_interview: Star,
    career_guidance: Compass, // Fallback to Compass or similar
    resume_review: FileText,
    priority_dm: MessageSquare,
  }[service.serviceType] || HelpCircle;

  return (
    <div className="group bg-white p-6 rounded-[1.5rem] ghost-border flex flex-col sm:flex-row justify-between items-center gap-6 hover:ambient-shadow transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#1d2b3e] group-hover:bg-[#1d2b3e] group-hover:text-white transition-colors">
          {service.emoji ? <span className="text-2xl">{service.emoji}</span> : <IconComponent size={30} />}
        </div>
        <div>
          <h4 className="font-headline text-xl font-bold text-[#1d2b3e]">{service.title}</h4>
          <p className="text-[#44474c] text-sm">{service.description?.slice(0, 100)}{service.description?.length > 100 ? '...' : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <span className="text-2xl font-black font-headline text-[#1d2b3e]">
          {service.isFree || service.price === 0 ? 'Free' : `${currencySymbol}${convertPrice(service.price, preferredCurrency || 'INR')}`}
        </span>
        <button
          onClick={() => onBook(service)}
          className="primary-gradient text-white px-8 py-3 rounded-xl font-headline font-bold text-sm active:scale-95 transition-all"
        >
          Select
        </button>
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

  const handleConfirmBooking = (bookingData) => {
    // Instead of booking directly, navigate to checkout page
    setIsBookingModalOpen(false);
    
    // Extract date and time from scheduledAt ISO string
    const dateObj = new Date(bookingData.scheduledAt);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().split(' ')[0].slice(0,5); // "HH:MM"

    navigate(`/mentor/${handle}/checkout`, {
      state: {
        date: date,
        time: time,
        service: bookingService,
        mentor: mentor,
        mentorProfileId: bookingData.mentorProfileId,
        couponCode: bookingData.couponCode,
        couponResult: couponResult,
        remark: bookingData.remark, // Passes any notes filled in modal
        topics: bookingData.topics
      }
    });
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
    <div className="bg-[#fff8f5] min-h-screen text-[#1f1b18] font-body antialiased">
      <main className="pt-8 pb-20">
        {/* Hero Profile Section */}
        <section className="max-w-screen-xl mx-auto px-8 mb-16">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Profile Image & Quick Info (Sticky Sidebar) */}
            <div className="w-full md:w-1/3 sticky top-32">
              <div className="bg-white rounded-[2rem] p-4 ambient-shadow overflow-hidden">
                <img
                  alt={profile.displayName}
                  className="w-full aspect-[4/5] object-cover rounded-[1.5rem] mb-6"
                  src={profile.profileImage || mentor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&size=300&background=random`}
                />
                <div className="px-4 pb-4">
                  <h1 className="font-headline text-3xl font-extrabold text-[#1d2b3e] mb-1">{profile.displayName}</h1>
                  <p className="text-[#505f76] font-medium mb-4">{mentor?.jobTitle} {mentor?.company ? `@ ${mentor.company}` : ''}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.expertise?.slice(0, 3).map((exp, i) => (
                      <span key={i} className="bg-[#fbf2ed] text-[#1d2b3e] px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {profile.location?.city && (
                      <div className="flex items-center gap-3 text-[#44474c]">
                        <MapPin size={18} className="text-[#004944]" />
                        <span className="text-sm">{profile.location.city}, {profile.location.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[#44474c]">
                      <Clock size={18} className="text-[#004944]" />
                      <span className="text-sm">{profile.experienceYears || '12+'} Years Experience</span>
                    </div>
                    {profile.averageRating > 0 && (
                      <div className="flex items-center gap-3 text-[#44474c]">
                        <Star size={18} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-bold">{profile.averageRating.toFixed(1)} ({profile.totalReviews} Reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Expertise (Right Column) */}
            <div className="flex-1 space-y-12">
              <div>
                <h2 className="font-headline text-4xl font-extrabold text-[#1d2b3e] mb-6 tracking-tight">The Professional Navigator</h2>
                <div className="space-y-4 text-[#505f76] leading-relaxed text-lg max-w-2xl">
                  {profile.bio ? (
                    <p>{profile.bio}</p>
                  ) : (
                    <p>I specialize in bridging the gap between high-scale product infrastructure and human-centric marketing. I help startups and established tech giants find their voice in complex markets.</p>
                  )}
                </div>
              </div>

              {/* Expertise Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#fbf2ed] p-8 rounded-[1.5rem]">
                  <TrendingUp size={30} className="text-[#004944] mb-4" />
                  <h3 className="font-headline text-xl font-bold mb-2">Market Strategy</h3>
                  <p className="text-[#44474c] text-sm leading-relaxed">Defining GTM strategies for fintech and SaaS platforms looking to scale internationally.</p>
                </div>
                <div className="bg-[#004944] p-8 rounded-[1.5rem] text-white">
                  <Brain size={30} className="text-[#9cf2e8] mb-4" />
                  <h3 className="font-headline text-xl font-bold mb-2">Leadership Coaching</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Transitioning from Individual Contributor to Management within high-growth orgs.</p>
                </div>
                
                {profile.customSections?.filter(s => s.title?.toLowerCase().includes('achievement') || s.title?.toLowerCase().includes('highlight')).map((sec, i) => (
                  <div key={i} className="col-span-1 md:col-span-2 bg-[#eae1dc] p-8 rounded-[1.5rem]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline text-xl font-bold">{sec.title}</h3>
                      <Award size={24} className="text-[#1d2b3e]" />
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sec.content.split('\n').map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-[#004944] mt-1 fill-current" />
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Fallback Achievements if none found in profile */}
                {(!profile.customSections || !profile.customSections.some(s => s.title?.toLowerCase().includes('achievement'))) && (
                  <div className="col-span-1 md:col-span-2 bg-[#eae1dc] p-8 rounded-[1.5rem]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline text-xl font-bold">Key Achievements</h3>
                      <Award size={24} className="text-[#1d2b3e]" />
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-[#004944] mt-1 fill-current" />
                        <span className="text-sm font-medium">Led GTM for key product expansion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-[#004944] mt-1 fill-current" />
                        <span className="text-sm font-medium">Industry Recognition and Awards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-[#004944] mt-1 fill-current" />
                        <span className="text-sm font-medium">Mentored 50+ directors into VP roles</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Services Section */}
              <div id="services">
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="font-headline text-3xl font-extrabold text-[#1d2b3e]">Services</h2>
                  <p className="text-[#505f76] text-sm font-medium">Available for booking this month</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {services.map(s => (
                    <ServiceCard 
                      key={s._id} 
                      service={s} 
                      onBook={s.serviceType === 'priority_dm' 
                        ? (svc) => { if (!user) navigate('/login', { state: { from: `/mentor/${handle}` } }); else setDmService(svc); }
                        : (svc) => { 
                            if (!user) {
                              navigate('/login', { state: { from: `/mentor/${handle}` } }); 
                            } else { 
                              navigate(`/mentor/${handle}/checkout`, {
                                state: {
                                  mentor,
                                  mentorProfileId: profile._id,
                                  service: svc,
                                  couponCode: couponResult?.valid ? couponCode : undefined,
                                  couponResult: couponResult?.valid ? couponResult : undefined
                                }
                              });
                            } 
                          }
                      } 
                      preferredCurrency={data?.preferredCurrency} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* Priority DM Send Modal */}
      {dmService && (
        <SendDMModal
          mentor={mentor}
          service={dmService}
          onClose={() => setDmService(null)}
        />
      )}

    </div>
  );
}
