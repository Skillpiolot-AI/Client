import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { useAuth } from "../../AuthContext"
import { useNavigate } from "react-router-dom"
import config from "../../config"

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("Home")
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const navItems = [
        { name: "Home", path: "/", show: "both" },
        { name: "Pathfinder", path: "/Assesmentinfo", show: "both" },
        { name: "Mentors", path: "/mentors", show: "both" },
        { name: "About Us", path: "/about", show: "both" },
    ]

    const dropdownItems = {
        User: [
            { name: "👤 My Profile", path: "/profile" },
            { name: "📅 Upcoming Sessions", path: "/my-bookings" },
            { name: "💬 My DMs", path: "/my-dms" },
        ],
        Mentor: [
            { name: "📊 Mentor Dashboard", path: "/mentor-dashboard" },
            { name: "📅 Upcoming Sessions", path: "/mentor-sessions" },
            { name: "👤 My Profile", path: "/mentor-profile" },
            { name: "📥 Student DMs", path: "/mentor-dms" },
        ],
        Admin: [
            { name: "📊 Dashboard", path: "/dashboard" },
            { name: "💬 My DMs", path: "/my-dms" },
        ],
        UniTeach: [
            { name: "🏫 Teacher Portal", path: "/teacher/dashboard" },
        ],
        UniAdmin: [
            { name: "🏫 University Portal", path: "/uniAdminPortal" },
        ]
    }

    const handleLogout = () => {
        setIsDropdownOpen(false)
        logout()
    }

    const handleNavigation = (path) => {
        navigate(path)
        setIsOpen(false)
        setIsDropdownOpen(false)
    }

    return (
        <>
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F7]/95 backdrop-blur-md border-b border-[rgba(55,50,47,0.12)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div className="flex items-center">
                            <button
                                onClick={() => handleNavigation("/")}
                                className="text-[#2F3037] text-xl font-semibold hover:opacity-80 transition-opacity"
                            >
                                SkillPilot
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        handleNavigation(item.path)
                                        setActiveTab(item.name)
                                    }}
                                    className={`text-sm font-medium transition-colors ${activeTab === item.name
                                        ? "text-[#2F3037]"
                                        : "text-[rgba(49,45,43,0.80)] hover:text-[#2F3037]"
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>


                        {/* Right Section */}
                        <div className="flex items-center space-x-3">


                            {/* Auth Section */}
                            {isAuthenticated() && user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 px-3 py-1.5 bg-white shadow-sm rounded-full hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-6 h-6 bg-[#2F3037] rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">
                                                {user.role?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden sm:inline text-[#37322F] text-sm font-medium">
                                            {user.role || 'User'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 hidden sm:block" />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[rgba(55,50,47,0.12)] shadow-lg overflow-hidden"
                                            >
                                                <div className="py-1">
                                                    {dropdownItems[user.role]?.map((item) => (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => handleNavigation(item.path)}
                                                            className="w-full text-left px-4 py-2 text-sm text-[rgba(49,45,43,0.80)] hover:bg-gray-50 transition-colors"
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleNavigation("/login")}
                                        className="px-4 py-1.5 bg-white shadow-sm rounded-full text-[#37322F] text-sm font-medium hover:shadow-md transition-shadow"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        onClick={() => handleNavigation("/signup")}
                                        className="hidden md:flex px-4 py-1.5 bg-[#2F3037] text-white shadow-sm rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-all"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
                            >
                                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-[rgba(55,50,47,0.12)] bg-[#F9F8F7]"
                        >
                            <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            handleNavigation(item.path)
                                            setActiveTab(item.name)
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-lg text-sm text-[rgba(49,45,43,0.80)] hover:bg-white font-medium"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>


            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    )
}