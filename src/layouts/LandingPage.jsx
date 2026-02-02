import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Activity, ChevronDown, Menu, X } from "lucide-react"
import ThreeFeatureCards from "./ThreeFeatureCards"
import FeatureShowcase from "./FeatureShowcase"

// Mock components for demonstration
const HeroSection = () => (
  <div className="pt-24 pb-16 flex flex-col items-center px-4">
    <div className="max-w-4xl w-full text-center space-y-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#37322F] font-serif leading-tight">
        Find your mentor,
        <br />
        shape your future
      </h1>
      <p className="text-base sm:text-lg text-[rgba(55,50,47,0.80)] max-w-2xl mx-auto font-medium">
        Book mentors, discover your ideal career path through RIASEC assessment, learn new skills, and
        explore workshops worldwide.
      </p>
      <div className="pt-6">
        <a
          href="/signup"
          className="inline-flex items-center px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition-colors"
        >
          Start Your Journey
        </a>
      </div>
    </div>
  </div>
)

const SocialProof = () => (
  <div className="py-16 px-4 border-t border-gray-200">
    <div className="max-w-4xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
        <div className="text-sm font-medium text-[#37322F]">
          Trusted by 50K+ Young Professionals
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#49423D]">
        Success stories from your peers
      </h2>
      <p className="text-base text-[#605A57] max-w-2xl mx-auto">
        Join thousands of 18-25 year olds who found their perfect mentors
        and accelerated their career growth.
      </p>
    </div>
  </div>
)

const FAQSection = () => {
  const [openItems, setOpenItems] = useState([])

  const faqs = [
    {
      question: "What is MentorHub and who is it for?",
      answer: "MentorHub is a comprehensive mentorship platform designed for young professionals looking to advance their careers."
    },
    {
      question: "How does the mentorship booking work?",
      answer: "Simply browse our verified mentors, select one that matches your goals, and book a session at your convenience."
    },
    {
      question: "What is RIASEC assessment?",
      answer: "RIASEC is a career personality assessment that helps you discover your ideal career path based on your interests and strengths."
    }
  ]

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#49423D] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#605A57]">Everything you need to know about MentorHub</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenItems(prev =>
                  prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                )}
                className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#49423D]">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openItems.includes(index) ? "rotate-180" : ""
                  }`} />
              </button>
              {openItems.includes(index) && (
                <div className="pb-4 text-sm text-[#605A57]">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const CTASection = () => (
  <div className="py-16 px-4 border-t border-gray-200">
    <div className="max-w-4xl mx-auto text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#37322F]">Ready to Get Started?</h2>
      <p className="text-[#605A57] max-w-2xl mx-auto">
        Join thousands of students and professionals who are already using MentorHub to advance their careers.
      </p>
      <a
        href="/signup"
        className="inline-flex items-center px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition-colors"
      >
        Start Your Journey
      </a>
    </div>
  </div>
)

const FooterSection = () => (
  <footer className="py-12 px-4 border-t border-gray-200 bg-[#F9F8F7]">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-[#49423D] mb-4">MentorHub</h3>
          <p className="text-sm text-[#605A57]">Your career journey starts here</p>
        </div>

        <div>
          <h4 className="font-medium text-[#49423D] mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-[#605A57]">
            <li><a href="/mentorship" className="hover:text-[#37322F]">Mentors</a></li>
            <li><a href="/workshops" className="hover:text-[#37322F]">Workshops</a></li>
            <li><a href="/assessment" className="hover:text-[#37322F]">Assessment</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-[#49423D] mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-[#605A57]">
            <li><a href="/about" className="hover:text-[#37322F]">About</a></li>
            <li><a href="/careers" className="hover:text-[#37322F]">Careers</a></li>
            <li><a href="/contact" className="hover:text-[#37322F]">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-[#49423D] mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-[#605A57]">
            <li><a href="/view-books" className="hover:text-[#37322F]">Library</a></li>
            <li><a href="/community" className="hover:text-[#37322F]">Community</a></li>
            <li><a href="/updates" className="hover:text-[#37322F]">Updates</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200 text-center text-sm text-[#605A57]">
        © 2025 MentorHub. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#F9F8F7]">
      <HeroSection />
      <FeatureShowcase />
      <ThreeFeatureCards />
      <SocialProof />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}