"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Filter, Calendar } from 'lucide-react';

// Import components
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import MentorCard from './MentorCard';
import BookingModal from '../Bookings/BookingModal';
import CampaignBanner from './CampaignBanner';
import './styles.css';

/**
 * MentorList - Main page component for browsing mentors
 */
const MentorList = () => {
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campaign, setCampaign] = useState(null);

    // Search & Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recommended');

    // Filters
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [menteeType, setMenteeType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 40000]);
    const [experienceRange, setExperienceRange] = useState([0, 15]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Booking state
    const [isBooking, setIsBooking] = useState(false);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    const { user } = useAuth();
    const navigate = useNavigate();

    const inspirationalQuotes = [
        "Great mentors don't just teach, they inspire transformation.",
        "Every expert was once a beginner who never gave up.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The best time to learn was yesterday. The next best time is now.",
        "Mentorship is the gift of wisdom wrapped in experience.",
    ];

    // Fetch mentors on mount
    useEffect(() => {
        fetchMentors();
    }, []);

    // Filter mentors when criteria change
    useEffect(() => {
        filterMentors();
    }, [mentors, searchTerm, sortBy, selectedDomains, menteeType, priceRange, experienceRange]);

    // Quote rotation during booking
    useEffect(() => {
        let quoteInterval;
        if (isBooking) {
            quoteInterval = setInterval(() => {
                setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
            }, 8000);
        }
        return () => {
            if (quoteInterval) clearInterval(quoteInterval);
        };
    }, [isBooking]);

    // In MentorList.jsx - Line ~78
    const fetchMentors = async () => {
        try {
            setIsLoading(true);
            // ✅ Change from /mentors to /all-mentors
            const response = await axios.get(`${config.API_BASE_URL}/all-mentors`);

            // Handle the new API response structure
            const mentorData = response.data.mentors || response.data;
            setMentors(Array.isArray(mentorData) ? mentorData : []);
            setCampaign(response.data.campaign || null);
            setError(null);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            setError('Failed to fetch mentors. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterMentors = () => {
        let filtered = [...mentors];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(mentor =>
                (mentor.displayName || mentor.name || '').toLowerCase().includes(term) ||
                (mentor.jobTitle || '').toLowerCase().includes(term) ||
                (mentor.expertise || mentor.skills || []).some(skill =>
                    skill.toLowerCase().includes(term)
                ) ||
                (mentor.targetingDomains || []).some(domain =>
                    domain.toLowerCase().includes(term)
                )
            );
        }

        // Domain filter
        if (selectedDomains.length > 0) {
            filtered = filtered.filter(mentor => {
                const mentorDomains = (mentor.targetingDomains || []).map(d => d.toLowerCase());
                return selectedDomains.some(domain => {
                    const searchDomain = domain.toLowerCase();
                    // Match if backend domain contains search term OR search term contains backend domain
                    // This handles categories like "DevOps / SRE / Cloud"
                    return mentorDomains.some(d =>
                        d.includes(searchDomain) || searchDomain.includes(d)
                    );
                });
            });
        }

        // Mentee type filter
        if (menteeType) {
            filtered = filtered.filter(mentor => {
                const types = (mentor.preferredMenteeType || []).map(t => t.toLowerCase());
                const searchType = menteeType.toLowerCase();
                // Match if any mentor type is included in search term OR search term included in type
                return types.some(t => t.includes(searchType) || searchType.includes(t));
            });
        }

        // Price filter (check for free mentorship or price range)
        filtered = filtered.filter(mentor => {
            if (mentor.isFree) return true;

            // Calculate best monthly rate from plans
            const monthlyRates = (mentor.pricingPlans || []).map(p => {
                const months = p.duration === '6 Months' ? 6 : p.duration === '3 Months' ? 3 : 1;
                return p.price / months;
            }).filter(p => p > 0);

            const basePrice = mentor.pricing?.monthlyPrice || (monthlyRates.length > 0 ? Math.min(...monthlyRates) : 0);

            // If priceRange is [0, 40000], we interpret 40000 as "40000+"
            if (priceRange[1] === 40000) {
                return basePrice >= priceRange[0];
            }
            return basePrice >= priceRange[0] && basePrice <= priceRange[1];
        });

        // Experience filter
        filtered = filtered.filter(mentor => {
            const exp = parseInt(mentor.experience) || 0;
            // Handle "15+" case
            if (experienceRange[1] === 15) {
                return exp >= experienceRange[0];
            }
            return exp >= experienceRange[0] && exp <= experienceRange[1];
        });

        // Sort
        switch (sortBy) {
            case 'rating':
                filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = a.pricingPlans?.[0]?.price || a.pricing?.monthlyPrice || 0;
                    const priceB = b.pricingPlans?.[0]?.price || b.pricing?.monthlyPrice || 0;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = a.pricingPlans?.[0]?.price || a.pricing?.monthlyPrice || 0;
                    const priceB = b.pricingPlans?.[0]?.price || b.pricing?.monthlyPrice || 0;
                    return priceB - priceA;
                });
                break;
            case 'experience':
                filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
                break;
            case 'placements':
                filtered.sort((a, b) => (b.totalPlacements || 0) - (a.totalPlacements || 0));
                break;
            default:
                // Recommended - featured first, then by rating
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return (b.averageRating || 0) - (a.averageRating || 0);
                });
        }

        setFilteredMentors(filtered);
    };

    const handleDomainToggle = (domain) => {
        setSelectedDomains(prev =>
            prev.includes(domain)
                ? prev.filter(d => d !== domain)
                : [...prev, domain]
        );
    };

    const handleViewProfile = (mentorId) => {
        navigate(`/mentor/${mentorId}`);
    };

    const handleBookTrial = (mentor) => {
        if (!user) {
            navigate('/login', { state: { from: '/mentorship' } });
            return;
        }

        // Open booking modal
        setSelectedMentor(mentor);
        setBookingModalOpen(true);
    };

    const handleConfirmBooking = async (bookingData) => {
        setIsBooking(true);
        setCurrentQuoteIndex(0);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Session expired. Please login again.');
                navigate('/login', { state: { from: '/mentorship' } });
                setIsBooking(false);
                return;
            }

            const response = await axios.post(
                `${config.API_BASE_URL}/bookings/book`,
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('🎉 Session booked successfully! Check your email for the meeting link.');
            setBookingModalOpen(false);
            setSelectedMentor(null);
        } catch (error) {
            console.error('Error booking session:', error.response?.data || error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to book session. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mentor-list-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mentor-list-container">
                <div className="empty-state">
                    <div className="empty-icon">⚠️</div>
                    <h3 className="empty-title">Something went wrong</h3>
                    <p className="empty-text">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mentor-list-container">
            {/* Booking Loading Modal */}
            {isBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <div className="text-center space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                                <Calendar className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Your Session</h3>
                                <p className="text-gray-600">This may take a few moments...</p>
                            </div>
                            <div className="h-20 flex items-center justify-center">
                                <p className="text-indigo-700 italic font-medium text-center px-4">
                                    "{inspirationalQuotes[currentQuoteIndex]}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mentor-list-content">
                {/* Campaign Banner */}
                <CampaignBanner campaign={campaign} />

                {/* Search Bar */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <div className="mentor-list-layout">
                    {/* Main Content */}
                    <div className="mentor-list-main">
                        {filteredMentors.length > 0 ? (
                            <>
                                {filteredMentors.map((mentor) => (
                                    <MentorCard
                                        key={mentor._id || mentor.userId}
                                        mentor={mentor}
                                        onViewProfile={handleViewProfile}
                                        onBookTrial={handleBookTrial}
                                        isLoggedIn={!!user}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <Search />
                                </div>
                                <h3 className="empty-title">No mentors found</h3>
                                <p className="empty-text">Try adjusting your search criteria or filters</p>
                            </div>
                        )}
                    </div>

                    {/* Filter Sidebar */}
                    <FilterSidebar
                        selectedDomains={selectedDomains}
                        onDomainToggle={handleDomainToggle}
                        onClearDomains={() => setSelectedDomains([])}
                        menteeType={menteeType}
                        onMenteeTypeChange={setMenteeType}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        experienceRange={experienceRange}
                        onExperienceChange={setExperienceRange}
                        isOpen={mobileFiltersOpen}
                        onClose={() => setMobileFiltersOpen(false)}
                    />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    className="mobile-filter-toggle"
                    onClick={() => setMobileFiltersOpen(true)}
                >
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => {
                    setBookingModalOpen(false);
                    setSelectedMentor(null);
                }}
                mentor={selectedMentor}
                onConfirmBooking={handleConfirmBooking}
                isBooking={isBooking}
            />

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default MentorList;
