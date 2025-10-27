import { ArrowRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import SplineScene from "./SplineScene"

export default function Hero() {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    // Navigate to the assessment page
    navigate('/assessment');
  };

  const handleLearnMore = () => {
    // Scroll to a section or navigate to info page
    // For now, let's navigate to assessment info
    navigate('/Assesmentinfo');
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center items-start text-left max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Discover Your Perfect Career Path with AI
        </h1>
        <p className="mt-6 text-gray-700 text-lg">
          Personalized career guidance powered by RIASEC assessment, O*NET data, and AI.
          Explore careers, find colleges in India, and get matched with opportunities
          that fit your unique strengths.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={handleStartAssessment}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Start Your Assessment
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={handleLearnMore}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Learn How It Works
          </button>
        </div>

        <div className="flex items-center gap-8 text-sm text-gray-600 mt-8">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Free Assessment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Instant Results</span>
          </div>
        </div>
      </div>

      {/* Right content - 3D Scene */}
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <SplineScene />
      </div>
    </section>
  )
}