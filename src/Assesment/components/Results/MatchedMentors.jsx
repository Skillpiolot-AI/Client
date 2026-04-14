import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Briefcase, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config.jsx';

// Maps career names / clusters to search keywords for expertise matching
const extractKeywords = (careers) => {
  if (!careers || careers.length === 0) return [];
  
  const seen = new Set();
  const keywords = [];

  careers.slice(0, 5).forEach((career) => {
    // Try cluster first, then career name words
    const sources = [
      career.cluster,
      career.name,
      career.career_type,
    ].filter(Boolean);

    sources.forEach((src) => {
      // Split compound strings like "Data Science & Analytics" into individual terms
      src.split(/[\s,&/]+/).forEach((word) => {
        const clean = word.trim();
        if (clean.length > 3 && !seen.has(clean.toLowerCase())) {
          seen.add(clean.toLowerCase());
          keywords.push(clean);
        }
      });
    });
  });

  // Return top 4 unique keywords
  return keywords.slice(0, 4);
};

const StarRating = ({ rating }) => {
  const stars = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-[#eae1dc]'}
        />
      ))}
      <span className="text-xs font-semibold text-[#515f74] ml-1">
        {rating ? rating.toFixed(1) : 'New'}
      </span>
    </div>
  );
};

const MentorCard = ({ mentor, idx }) => {
  const navigate = useNavigate();
  const profileUrl = `/mentor/${mentor.handle || mentor.mentorProfileId}`;

  const initials = (mentor.name || 'M')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const bgColors = [
    'bg-[#1d2b3e]',
    'bg-[#004944]',
    'bg-[#334155]',
    'bg-[#4a3728]',
    'bg-[#5c2d7e]',
    'bg-[#1e4a6e]',
  ];
  const avatarBg = bgColors[idx % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white border border-[#eae1dc] rounded-[2rem] p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-[0_16px_40px_rgba(31,27,24,0.08)] group"
    >
      {/* Avatar + Basic Info */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${avatarBg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
          {mentor.profileImage ? (
            <img
              src={mentor.profileImage}
              alt={mentor.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-white font-bold text-lg">${initials}</span>`; }}
            />
          ) : (
            <span className="text-white font-bold text-lg">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-[#1d2b3e] text-base leading-tight truncate">
            {mentor.name || 'Mentor'}
          </h3>
          <p className="text-xs text-[#515f74] mt-0.5 truncate">
            {mentor.jobTitle || 'Industry Expert'}
            {mentor.companiesWorked?.length > 0 && (
              <span className="text-[#004944] font-semibold"> @ {mentor.companiesWorked[0]}</span>
            )}
          </p>
          <div className="mt-1">
            <StarRating rating={mentor.averageRating} />
          </div>
        </div>
      </div>

      {/* Tagline */}
      {mentor.tagline && (
        <p className="text-xs text-[#44474c] leading-relaxed line-clamp-2 italic border-l-2 border-[#eae1dc] pl-3">
          "{mentor.tagline}"
        </p>
      )}

      {/* Expertise Chips */}
      {mentor.expertise?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {mentor.expertise.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-[#fbf2ed] text-[#1d2b3e] text-[10px] font-bold rounded-lg uppercase tracking-wide"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-xs text-[#515f74]">
        {mentor.totalReviews > 0 && (
          <span className="flex items-center gap-1">
            <Users size={12} className="text-[#004944]" />
            {mentor.totalReviews} reviews
          </span>
        )}
        {mentor.experience > 0 && (
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-[#004944]" />
            {mentor.experience}y exp
          </span>
        )}
        {mentor.totalPlacements > 0 && (
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-[#004944]" />
            {mentor.totalPlacements} placed
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(profileUrl)}
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1d2b3e] text-white text-sm font-bold rounded-xl hover:bg-[#004944] transition-colors group-hover:gap-3 active:scale-95"
      >
        Book a Session
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
};

const MatchedMentors = ({ careers }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!careers || careers.length === 0) return;
    const kw = extractKeywords(careers);
    setKeywords(kw);
    fetchMentors(kw);
  }, [careers]);

  const fetchMentors = async (kw) => {
    if (!kw || kw.length === 0) return;
    setLoading(true);
    try {
      // Try first keyword, fallback to second if no results
      for (const keyword of kw) {
        const url = `${config.API_BASE_URL}/all-mentors?expertise=${encodeURIComponent(keyword)}&limit=6&sortBy=averageRating&sortOrder=desc`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.mentors && data.mentors.length > 0) {
          setMentors(data.mentors.slice(0, 6));
          setLoading(false);
          return;
        }
      }

      // If no expertise match found, fall back to all featured mentors
      const fallback = await fetch(`${config.API_BASE_URL}/all-mentors?limit=6&sortBy=averageRating&sortOrder=desc`);
      const fallbackData = await fallback.json();
      setMentors(fallbackData.mentors?.slice(0, 6) || []);
    } catch (err) {
      console.error('Failed to fetch matched mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!careers || careers.length === 0) return null;

  return (
    <section className="mt-20 font-sans">
      {/* Section Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#004944]/10 text-[#004944] rounded-full">
          <Zap size={14} className="fill-current" />
          <span className="text-xs font-bold uppercase tracking-widest">RIASEC-Matched</span>
        </div>
        <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#1d2b3e] mb-3">
          Mentors From Your Field
        </h2>
        <p className="text-[#515f74] max-w-2xl">
          These mentors have walked the career paths your assessment recommends. Book a session and shortcut your journey.
        </p>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-[#515f74] font-medium">Matched on:</span>
            {keywords.map((kw, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-[#eae1dc] text-[#1d2b3e] text-xs font-semibold rounded-full">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mentor Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#eae1dc] rounded-[2rem] p-6 h-64 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eae1dc]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#eae1dc] rounded-full w-3/4" />
                  <div className="h-3 bg-[#eae1dc] rounded-full w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#eae1dc] rounded-full" />
                <div className="h-3 bg-[#eae1dc] rounded-full w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : mentors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, idx) => (
              <MentorCard key={mentor.id || idx} mentor={mentor} idx={idx} />
            ))}
          </div>
          {/* See All CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/mentors')}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#1d2b3e] text-[#1d2b3e] font-bold rounded-full hover:bg-[#1d2b3e] hover:text-white transition-all active:scale-95"
            >
              Explore All Mentors
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-[#515f74]">
          <p className="mb-4">No mentors found for your specific field yet.</p>
          <button
            onClick={() => navigate('/mentors')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#1d2b3e] text-white font-bold rounded-xl hover:bg-[#004944] transition-colors"
          >
            Browse All Mentors <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
};

export default MatchedMentors;
