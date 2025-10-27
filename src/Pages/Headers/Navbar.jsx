<<<<<<< HEAD
// import { useState, useRef, useEffect } from "react"
// import { useAuth } from "../../AuthContext"
// import { motion, AnimatePresence } from "framer-motion"
// import config from "../../config"
// import { Bell, Sparkles } from "lucide-react"

// // Server Status Hook
// const useServerStatus = () => {
//   const [isOnline, setIsOnline] = useState(false)
//   const [lastChecked, setLastChecked] = useState(null)
//   const [isChecking, setIsChecking] = useState(false)

//   const checkServerStatus = async () => {
//     setIsChecking(true)
//     try {
//       const controller = new AbortController()
//       const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

//       const response = await fetch(`${config.API_BASE_URL1}/health`, {
//         method: "GET",
//         signal: controller.signal,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       clearTimeout(timeoutId)

//       if (response.ok) {
//         setIsOnline(true)
//       } else {
//         setIsOnline(false)
//       }
//     } catch (error) {
//       console.log("Server status check failed:", error.message)
//       setIsOnline(false)
//     } finally {
//       setIsChecking(false)
//       setLastChecked(new Date())
//     }
//   }

//   useEffect(() => {
//     // Initial check
//     checkServerStatus()

//     // Check every 30 seconds
//     const interval = setInterval(checkServerStatus, 30000)

//     return () => clearInterval(interval)
//   }, [])

//   return { isOnline, isChecking, lastChecked, checkServerStatus }
// }

// // Server Status Indicator Component
// const ServerStatusIndicator = ({ isOnline, isChecking, onRefresh }) => {
//   if (isChecking) {
//     return (
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-800 text-xs font-medium shadow-sm"
//       >
//         <div className="relative">
//           <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
//           <div className="absolute inset-0 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75"></div>
//         </div>
//         <span className="font-semibold">Checking...</span>
//       </motion.div>
//     )
//   }

//   return (
//     <motion.button
//       initial={{ scale: 0.8, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       whileHover={{ scale: 1.05, y: -1 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onRefresh}
//       className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
//         isOnline
//           ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 hover:from-emerald-100 hover:to-green-100 border border-emerald-200"
//           : "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 hover:from-red-100 hover:to-rose-100 border border-red-200"
//       }`}
//     >
//       <div className="relative flex items-center justify-center">
//         {isOnline ? (
//           <>
//             <motion.div
//               className="w-2 h-2 bg-emerald-500 rounded-full"
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
//             />
//             <motion.div
//               className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full opacity-60"
//               animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
//               transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
//             />
//           </>
//         ) : (
//           <div className="w-2 h-2 bg-red-500 rounded-full relative">
//             <motion.div
//               className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full"
//               animate={{ scale: [1, 1.3, 1], opacity: [1, 0.3, 1] }}
//               transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
//             />
//           </div>
//         )}
//       </div>

//       <span className="select-none">{isOnline ? "Server Online" : "Server Offline"}</span>

//       <motion.div
//         className={`w-3 h-3 rounded-full flex items-center justify-center ${
//           isOnline ? "bg-emerald-200" : "bg-red-200"
//         }`}
//         whileHover={{ rotate: 180 }}
//         transition={{ duration: 0.3 }}
//       >
//         <svg
//           className={`w-2 h-2 ${isOnline ? "text-emerald-600" : "text-red-600"}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//           />
//         </svg>
//       </motion.div>

//       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
//         <div
//           className={`px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap ${
//             isOnline ? "bg-emerald-800 text-emerald-100" : "bg-red-800 text-red-100"
//           }`}
//         >
//           Click to refresh
//           <div
//             className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-transparent ${
//               isOnline ? "border-t-emerald-800" : "border-t-red-800"
//             }`}
//           ></div>
//         </div>
//       </div>
//     </motion.button>
//   )
// }

// // Updates Button Component
// const UpdatesButton = () => {
//   return (
//     <motion.a
//       href="/updates"
//       whileHover={{ scale: 1.05, y: -1 }}
//       whileTap={{ scale: 0.95 }}
//       className="group relative flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
//     >
//       {/* Animated icon */}
//       <div className="relative">
//         <motion.div
//           animate={{ 
//             rotate: [0, -10, 10, -10, 0],
//             scale: [1, 1.1, 1]
//           }}
//           transition={{ 
//             duration: 2,
//             repeat: Infinity,
//             repeatDelay: 3
//           }}
//         >
//           <Sparkles className="w-4 h-4" />
//         </motion.div>

//         {/* Pulse effect */}
//         <motion.div
//           className="absolute inset-0 w-4 h-4 bg-purple-400 rounded-full opacity-20"
//           animate={{ 
//             scale: [1, 1.5, 1],
//             opacity: [0.2, 0, 0.2]
//           }}
//           transition={{
//             duration: 2,
//             repeat: Infinity,
//             repeatDelay: 1
//           }}
//         />
//       </div>

//       <span className="select-none">Latest Updates</span>

//       {/* Notification dot */}
//       <motion.div
//         className="w-2 h-2 bg-purple-500 rounded-full"
//         animate={{
//           scale: [1, 1.2, 1],
//           opacity: [1, 0.7, 1]
//         }}
//         transition={{
//           duration: 1.5,
//           repeat: Infinity
//         }}
//       />

//       {/* Hover tooltip */}
//       <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
//         <div className="px-3 py-1 text-xs bg-purple-800 text-purple-100 rounded shadow-lg whitespace-nowrap">
//           Check what's new
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-transparent border-t-purple-800"></div>
//         </div>
//       </div>
//     </motion.a>
//   )
// }

// const NavLink = ({ to, children, className, onClick }) => {
//   return (
//     <a href={to} className={className} onClick={onClick}>
//       {children}
//     </a>
//   )
// }

// export default function Navbar() {
//   const { logout } = useAuth()
//   const token = localStorage.getItem("token")
//   const role = localStorage.getItem("role")
//   const [isOpen, setIsOpen] = useState(false)
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Server status hook
//   const { isOnline, isChecking, lastChecked, checkServerStatus } = useServerStatus()

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Roadmap", path: "/combinedquiz" },
//     { name: "Mentorship", path: "/mentorship" },
//     { name: "Workshop", path: "/workshops" },
//     { name: "Community", path: "/community" },
//     { name: "PathWays", path: "/careerPaths" },
//   ]

//   const dropdownItems = {
//     User: [
//       { name: "Profile", path: "/profile" },
//       { name: "My Applications", path: "/my-applications" },
//       { name: "Resources", path: "/view-books" },
//       { name: "Workshops", path: "/workshops" },
//     ],
//     Mentor: [
//       { name: "Profile", path: "/mentorDashboard" },
//       { name: "My Sessions", path: "/my-sessions" },
//       { name: "Resources", path: "/view-books" },
//       { name: "Mentor Training", path: "/learnlist" },
//       { name: "Dashboard", path: "/amdashboard" },
//     ],
//     Admin: [
//       { name: "Main", path: "/dashboard" },
//       { name: "Dashboard", path: "/dashboardAdmin" },
//       { name: "Manage Users", path: "/manage-users" },
//       { name: "Updates", path: "/admin/updates" },
//       { name: "Reports", path: "/reports" },
//       { name: "Feedback", path: "/userFeedback" },
//     ],
//   }

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center space-x-4">
//             <NavLink to="/" className="flex-shrink-0 flex items-center">
//               <span className="text-xl font-bold text-gray-800">Skill-Pilot</span>
//             </NavLink>

//             {/* Server Status Indicator - Desktop */}
//             <div className="hidden sm:block">
//               <ServerStatusIndicator isOnline={isOnline} isChecking={isChecking} onRefresh={checkServerStatus} />
//             </div>

//             {/* Updates Button - Desktop */}
//             <div className="hidden sm:block">
//               <UpdatesButton />
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
//             {navItems.map((item) => (
//               <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <NavLink
//                   to={item.path}
//                   className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-600 hover:bg-indigo-50 transition duration-150 ease-in-out"
//                 >
//                   {item.name}
//                 </NavLink>
//               </motion.div>
//             ))}

//             {token && (
//               <div className="relative" ref={dropdownRef}>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 text-gray-800 hover:bg-indigo-200 transition duration-150 ease-in-out flex items-center space-x-2"
//                 >
//                   <span>{role}</span>
//                   <motion.svg
//                     animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </motion.svg>
//                 </motion.button>

//                 <AnimatePresence>
//                   {isDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
//                     >
//                       <div className="py-1">
//                         {dropdownItems[role]?.map((item) => (
//                           <NavLink
//                             key={item.name}
//                             to={item.path}
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
//                             onClick={() => setIsDropdownOpen(false)}
//                           >
//                             {item.name}
//                           </NavLink>
//                         ))}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>

//           {/* Auth Buttons - Desktop */}
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             {!token ? (
//               <>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <NavLink
//                     to="/login"
//                     className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
//                   >
//                     Login
//                   </NavLink>
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <NavLink
//                     to="/signup"
//                     className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition duration-150 ease-in-out"
//                   >
//                     Signup
//                   </NavLink>
//                 </motion.div>
//               </>
//             ) : (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={logout}
//                 className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-150 ease-in-out"
//               >
//                 Logout
//               </motion.button>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="-mr-2 flex items-center sm:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//             >
//               <span className="sr-only">Open main menu</span>
//               {isOpen ? (
//                 <motion.svg
//                   initial={{ rotate: 0 }}
//                   animate={{ rotate: 90 }}
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </motion.svg>
//               ) : (
//                 <motion.svg
//                   initial={{ rotate: 90 }}
//                   animate={{ rotate: 0 }}
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </motion.svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="sm:hidden overflow-hidden"
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
//               {/* Server Status - Mobile */}
//               <div className="flex justify-center pb-3 border-b border-gray-100">
//                 <ServerStatusIndicator isOnline={isOnline} isChecking={isChecking} onRefresh={checkServerStatus} />
//               </div>

//               {/* Updates Button - Mobile */}
//               <div className="flex justify-center pb-3 border-b border-gray-100">
//                 <UpdatesButton />
//               </div>

//               {/* Navigation Items */}
//               {navItems.map((item) => (
//                 <motion.div key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
//                   <NavLink
//                     to={item.path}
//                     className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item.name}
//                   </NavLink>
//                 </motion.div>
//               ))}

//               {/* Dropdown Items for Mobile */}
//               {token &&
//                 dropdownItems[role]?.map((item) => (
//                   <motion.div key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
//                     <NavLink
//                       to={item.path}
//                       className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out border-l-2 border-indigo-200 ml-2"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       {item.name}
//                     </NavLink>
//                   </motion.div>
//                 ))}

//               {/* Auth Buttons - Mobile */}
//               <div className="pt-2 border-t border-gray-100">
//                 {!token ? (
//                   <>
//                     <motion.div whileTap={{ scale: 0.95 }}>
//                       <NavLink
//                         to="/login"
//                         className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         Login
//                       </NavLink>
//                     </motion.div>
//                     <motion.div whileTap={{ scale: 0.95 }}>
//                       <NavLink
//                         to="/signup"
//                         className="block mx-3 my-2 px-3 py-2 rounded-md text-base font-medium bg-gray-600 text-white hover:bg-gray-700 transition duration-150 ease-in-out text-center"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         Signup
//                       </NavLink>
//                     </motion.div>
//                   </>
//                 ) : (
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       logout()
//                       setIsOpen(false)
//                     }}
//                     className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-150 ease-in-out"
//                   >
//                     Logout
//                   </motion.button>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {lastChecked && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="hidden sm:block fixed top-20 right-4 z-40"
//         >
//           <div
//             className={`px-3 py-2 rounded-lg shadow-lg text-xs ${
//               isOnline
//                 ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
//                 : "bg-red-50 text-red-800 border border-red-200"
//             }`}
//           >
//           </div>
//         </motion.div>
//       )}
//     </nav>
//   )
// }

=======
>>>>>>> backup-feature-update

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
