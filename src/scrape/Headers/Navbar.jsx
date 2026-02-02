
"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import config from "../../config"
import { Sparkles, Activity, ChevronDown, Menu, X, Rocket } from "lucide-react"

// Server Status Hook
const useServerStatus = () => {
  const [isOnline, setIsOnline] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkServerStatus = async () => {
    setIsChecking(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${config.API_BASE_URL1}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setIsOnline(true)
      } else {
        setIsOnline(false)
      }
    } catch (error) {
      console.log("Server status check failed:", error.message)
      setIsOnline(false)
    } finally {
      setIsChecking(false)
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkServerStatus()
    const interval = setInterval(checkServerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return { isOnline, isChecking, lastChecked, checkServerStatus }
}

// Server Status Indicator Component
const ServerStatusIndicator = ({ isOnline, isChecking, onRefresh }) => {
  if (isChecking) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground text-xs font-medium"
      >
        <div className="relative">
          <motion.div
            className="w-2 h-2 bg-warning rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
        <span className="font-medium">Checking...</span>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRefresh}
      className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${isOnline
          ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
          : "bg-error/10 text-error border-error/20 hover:bg-error/20"
        }`}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-error"}`}
          animate={isOnline ? { scale: [1, 1.2, 1] } : { scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        {isOnline && (
          <motion.div
            className="absolute inset-0 w-2 h-2 bg-success rounded-full opacity-40"
            animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        )}
      </div>

      <span className="select-none">{isOnline ? "Online" : "Offline"}</span>

      <Activity className="w-3 h-3 opacity-60" />
    </motion.button>
  )
}

// Updates Button Component
const UpdatesButton = () => {
  return (
    <motion.a
      href="/updates"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm font-medium transition-all duration-300"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 5,
        }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <span className="select-none">Updates</span>

      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </motion.a>
  )
}

const NavLink = ({ to, children, className, onClick, isActive = false }) => {
  return (
    <motion.a
      href={to}
      className={`relative ${className}`}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.a>
  )
}

export default function Navbar() {
  const { logout } = useAuth()
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")
  const dropdownRef = useRef(null)

  const { isOnline, isChecking, lastChecked, checkServerStatus } = useServerStatus()

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
    { name: "Home", path: "/", icon: null },
    { name: "Roadmap", path: "/combinedquiz", icon: null },
    { name: "Mentorship", path: "/mentorship", icon: null },
    { name: "Workshop", path: "/workshops", icon: null },
    { name: "Community", path: "/community", icon: null },
    { name: "PathWays", path: "/careerPaths", icon: null },
  ]

  const dropdownItems = {
    User: [
      { name: "Profile", path: "/profile" },
      { name: "My Applications", path: "/my-applications" },
      { name: "Resources", path: "/view-books" },
      { name: "Workshops", path: "/workshops" },
    ],
    Mentor: [
      { name: "Profile", path: "/mentorDashboard" },
      { name: "My Sessions", path: "/my-sessions" },
      { name: "Resources", path: "/view-books" },
      { name: "Mentor Training", path: "/learnlist" },
      { name: "Dashboard", path: "/amdashboard" },
    ],
    Admin: [
      { name: "Main", path: "/dashboard" },
      { name: "University", path: "/universityManagement" },
      { name: "Dashboard", path: "/dashboardAdmin" },
      { name: "Manage Users", path: "/manage-users" },
      { name: "Updates", path: "/admin/updates" },
      { name: "Reports", path: "/reports" },
      { name: "Feedback", path: "/userFeedback" },
    ],
    UniTeach : [
      { name: "Dashboard", path: "/teacher/dashboard" },
    ],
    UniAdmin :[
      { name: "Dashboard", path: "/uniAdminPortal" },
    ]
  }

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="grid-pattern absolute inset-0 opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Status */}
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink to="/" className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Skill-Pilot
                </span>
              </NavLink>
            </motion.div>

            {/* Status indicators - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <ServerStatusIndicator isOnline={isOnline} isChecking={isChecking} onRefresh={checkServerStatus} />
              <UpdatesButton />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                isActive={activeTab === item.name}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                onClick={() => setActiveTab(item.name)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* User Menu and Auth - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {token && (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{role?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span>{role}</span>
                  <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
                    >
                      <div className="py-2">
                        {dropdownItems[role]?.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NavLink
                              to={item.path}
                              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.name}
                            </NavLink>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth Buttons */}
            {!token ? (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  Login
                </NavLink>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                  >
                    Get Started
                  </NavLink>
                </motion.div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border/50 bg-card/50 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Status indicators - Mobile */}
              <div className="flex flex-col space-y-3 pb-4 border-b border-border/50">
                <ServerStatusIndicator isOnline={isOnline} isChecking={isChecking} onRefresh={checkServerStatus} />
                <UpdatesButton />
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* User menu items - Mobile */}
              {token && dropdownItems[role] && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {role} Menu
                  </div>
                  {dropdownItems[role].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + index) * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 border-l-2 border-primary/20 ml-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Auth section - Mobile */}
              <div className="pt-4 border-t border-border/50 space-y-3">
                {!token ? (
                  <>
                    <NavLink
                      to="/login"
                      className="block px-4 py-3 rounded-lg text-base font-medium text-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="block px-4 py-3 rounded-lg text-base font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </NavLink>
                  </>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-3 rounded-lg text-base font-medium text-center bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                  >
                    Logout
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
