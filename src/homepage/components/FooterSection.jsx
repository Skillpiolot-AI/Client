import { Link } from "react-router-dom"
import { useCurrency } from "../../CurrencyContext"

export default function FooterSection() {
  const { selectedCurrency, setSelectedCurrency, rates } = useCurrency();
  const footerLinks = {
    "Career Growth": [
      { name: "Pathfinder", path: "/Assesmentinfo" },
      { name: "Career Quiz", path: "/careerquiz" },
      { name: "Prediction Hub", path: "/combinedquiz" },
      { name: "Job Titles", path: "/jobtitleall" },
      { name: "Recommendation Hub", path: "/recommendation" },
      { name: "Tech Career Paths", path: "/careerPaths" },
    ],
    "Mentorship": [
      { name: "Find Mentors", path: "/mentorship" },
      { name: "Mentor Home", path: "/mentorHome" },
      { name: "Book Session", path: "/schedulementor" },
      { name: "Mentor Registration", path: "/application" },
      { name: "Application Tracker", path: "/tracker" },
      { name: "My Bookings", path: "/my-bookings" },
    ],
    "Resources & Community": [
      { name: "Resource Library", path: "/view-books" },
      { name: "Video Lessons", path: "/learnlist" },
      { name: "Workshops", path: "/workshops" },
      { name: "Community", path: "/community" },
      { name: "Latest Updates", path: "/updates" },
      { name: "Documentation", path: "/docs" },
    ],
    "Portals & Account": [
      { name: "My Profile", path: "/profile" },
      { name: "My Applications", path: "/my-applications" },
    ],
    "Company": [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/#contact" },
      { name: "Careers", path: "/careers" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ]
  }

  return (
    <div className="w-full pt-16 flex flex-col justify-start items-start bg-[#F9F8F7] border-t border-[rgba(55,50,47,0.12)]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col items-stretch px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 pb-12">
          {/* Brand Section */}
          <div className="flex flex-col justify-start items-start gap-6 lg:max-w-xs">
            <div className="flex justify-start items-center gap-3">
              <div className="text-[#49423D] text-2xl font-bold font-sans tracking-tight">SkillPilot</div>
            </div>
            <div className="text-[rgba(73,66,61,0.70)] text-sm font-medium font-sans leading-relaxed">
              Empowering the next generation of professionals with AI-driven career guidance and expert mentorship.
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-start items-start gap-5 pt-2">
              <a href="#" className="text-[#49423D] opacity-60 hover:opacity-100 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-[#49423D] opacity-60 hover:opacity-100 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="text-[#49423D] opacity-60 hover:opacity-100 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-10 flex-grow pt-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="flex flex-col justify-start items-start gap-5">
                <div className="text-[rgba(73,66,61,0.50)] text-xs font-bold uppercase tracking-[0.1em] font-sans">
                  {title}
                </div>
                <div className="flex flex-col justify-start items-start gap-3">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-[#49423D] text-[13px] font-medium leading-5 font-sans hover:text-[#37322F] hover:translate-x-1 transition-all duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full border-t border-[rgba(55,50,47,0.12)] bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[#605A57] text-xs font-medium">
            © 2025 SkillPilot Platform. Built for the future of talent.
          </div>
          <div className="flex items-center gap-6">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-transparent border border-[rgba(55,50,47,0.2)] rounded-lg px-3 py-1 text-xs font-semibold text-[#605A57] cursor-pointer hover:border-[rgba(55,50,47,0.4)] focus:outline-none bg-white transition-all duration-200"
            >
              {Object.keys(rates).length > 0 ? (
                Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)
              ) : (
                ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'].map(c => <option key={c} value={c}>{c}</option>)
              )}
            </select>
            <Link to="/privacy" className="text-[#605A57] text-xs font-medium hover:text-[#37322F] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[#605A57] text-xs font-medium hover:text-[#37322F] transition-colors">Terms of Service</Link>
            <Link to="/docs" className="text-[#605A57] text-xs font-medium hover:text-[#37322F] transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
