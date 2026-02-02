import { CheckCircle } from "lucide-react"

export default function ProblemSolution() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Confused About Your Career?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                Unsure which career aligns with your personality and skills
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                Overwhelmed by thousands of career options and educational paths
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                Don't know which colleges in India offer your desired programs
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                Making career decisions without data-driven insights
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">We Guide You to Your Ideal Career</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                AI-powered RIASEC assessment reveals your personality type and ideal careers
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                Explore 1000+ careers with detailed O*NET data and salary insights
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                Discover colleges in India that match your career goals
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                Get personalized recommendations based on your unique profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
