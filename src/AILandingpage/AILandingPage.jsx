import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ProblemSolution from "./components/ProblemSolution"
import RiasecSection from "./components/RiasecSection"
import FeaturesSection from "./components/FeaturesSection"
import TestimonialsSection from "./components/TestimonialsSection"
import BenefitsSection from "./components/BenefitsSection"
import PricingSection from "./components/PricingSection"
import ProcessSection from "./components/ProcessSection"
import CTASection from "./components/CTASection"
import Footer from "./components/Footer"
import "./styles/main.css"

export default function AILandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProblemSolution />
      <RiasecSection />
      <FeaturesSection />
      <TestimonialsSection />
      <BenefitsSection />
      {/* <PricingSection /> */}
      <ProcessSection />
      <CTASection />
  
    </div>
  )
}
