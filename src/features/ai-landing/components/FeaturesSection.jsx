import { Brain, Compass, GraduationCap, Zap, BookOpen } from "lucide-react"

const features = [
  {
    title: "RIASEC Assessment",
    icon: Brain,
    description:
      "Take our scientifically-backed RIASEC personality assessment to discover your career personality type and get matched with ideal career paths.",
    cta: "Take Assessment",
  },
  {
    title: "O*NET Career Explorer",
    icon: Compass,
    description:
      "Explore 1000+ careers with detailed O*NET data including job descriptions, required skills, salary ranges, and growth projections.",
    cta: "Explore Careers",
  },
  {
    title: "College Finder (India)",
    icon: GraduationCap,
    description:
      "Search and compare colleges across India that offer programs aligned with your career goals and interests.",
    cta: "Find Colleges",
  },
  {
    title: "Personalized Recommendations",
    icon: Zap,
    description:
      "Get AI-powered career recommendations tailored to your RIASEC profile, skills, and educational background.",
    cta: "Get Recommendations",
  },
  {
    title: "Career Insights & Analytics",
    icon: BookOpen,
    description:
      "Access detailed career analytics, market trends, skill requirements, and salary data to make informed decisions.",
    cta: "View Analytics",
  },
]

export default function FeaturesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Career Guidance Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive tools to guide your career journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 space-y-4"
              >
                <Icon className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                  {feature.cta} →
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
