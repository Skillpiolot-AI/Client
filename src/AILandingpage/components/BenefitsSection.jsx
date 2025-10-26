import { Brain, Compass, GraduationCap, Zap } from "lucide-react"

const benefits = [
  {
    icon: Brain,
    title: "Science-Backed",
    description: "RIASEC model used by career counselors worldwide",
    color: "green",
  },
  {
    icon: Compass,
    title: "1000+ Careers",
    description: "Comprehensive O*NET database with real job data",
    color: "blue",
  },
  {
    icon: GraduationCap,
    title: "500+ Colleges",
    description: "All major colleges in India with program details",
    color: "purple",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Personalized recommendations just for you",
    color: "orange",
  },
]

const colorClasses = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
}

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Our Platform</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Data-driven career guidance for Indian students</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.title} className="text-center space-y-4">
                <div
                  className={`h-16 w-16 ${colorClasses[benefit.color]} rounded-full flex items-center justify-center mx-auto`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
