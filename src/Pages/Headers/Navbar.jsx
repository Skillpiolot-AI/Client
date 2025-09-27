
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { logout } = useAuth()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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
    { name: 'Home', path: '/' },
    { name: 'Roadmap', path: '/combinedquiz' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Workshop', path: '/workshops' },
    { name: 'Community', path: '/community' },
    {name: "PathWays",path:"/careerPaths"
    },
  ]

  const dropdownItems = {
    User: [
      { name: 'Profile', path: '/profile' },
      { name: 'My Applications', path: '/my-applications' },
      { name: 'Resources', path: '/view-books' },
      {name: 'Workshops',path:'/workshops' }
    ],
    Mentor: [
      { name: 'Profile', path: '/mentorDashboard' },
      { name: 'My Sessions', path: '/my-sessions' },
      { name: 'Resources', path: '/view-books' },
      { name: 'Mentor Training', path :'/learnlist'},
      { name: 'Dashboard',path : '/amdashboard'}
    ],
    Admin: [
      {name: "Main",path:"/dashboard"},
      { name: 'Dashboard', path: '/dashboardAdmin' },
      { name: 'Manage Users', path: '/manage-users' },
      { name: 'Reports', path: '/reports' },
      {name: "Feedback",path:"/userFeedback"}
    ],
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Skill-Pilot</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-600 hover:bg-indigo-50 transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            {token && (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 text-gray-800 hover:bg-indigo-200 transition duration-150 ease-in-out"
                >
                  {role}
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {dropdownItems[role]?.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
<div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!token ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    Signup
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                Logout
              </motion.button>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {item.name}
            </Link>
          ))}
          {token && dropdownItems[role]?.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {item.name}
            </Link>
          ))}
          {!token ? (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gray-600 text-white hover:bg-gray-700 transition duration-150 ease-in-out"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  )
}