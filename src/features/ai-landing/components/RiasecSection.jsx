import { Target, Brain, Lightbulb, MessageSquare, TrendingUp, Compass } from "lucide-react"

const riasecTypes = [
  {
    title: "Realistic",
    icon: Target,
    color: "red",
    description:
      "Practical, hands-on individuals who prefer working with tools, machines, and physical tasks. Ideal for engineering, trades, and technical roles.",
  },
  {
    title: "Investigative",
    icon: Brain,
    color: "blue",
    description:
      "Analytical thinkers who enjoy research, problem-solving, and scientific inquiry. Perfect for science, research, and analytical careers.",
  },
  {
    title: "Artistic",
    icon: Lightbulb,
    color: "purple",
    description:
      "Creative individuals who express themselves through art, music, and design. Suited for creative industries and innovation roles.",
  },
  {
    title: "Social",
    icon: MessageSquare,
    color: "green",
    description:
      "People-oriented professionals who enjoy helping, teaching, and collaborating. Great for education, healthcare, and HR roles.",
  },
  {
    title: "Enterprising",
    icon: TrendingUp,
    color: "orange",
    description:
      "Ambitious leaders who enjoy persuasion, competition, and business. Ideal for management, sales, and entrepreneurship roles.",
  },
  {
    title: "Conventional",
    icon: Compass,
    color: "indigo",
    description:
      "Detail-oriented individuals who prefer structure and organization. Perfect for accounting, administration, and data roles.",
  },
]

const colorClasses = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  indigo: "bg-indigo-100 text-indigo-600",
}

export default function RiasecSection() {
  return (
    <section id="riasec" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Understanding RIASEC Assessment</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The RIASEC model identifies six personality types and matches them with suitable careers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {riasecTypes.map((type) => {
            const Icon = type.icon
            return (
              <div
                key={type.title}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 space-y-4"
              >
                <div className={`h-12 w-12 ${colorClasses[type.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                <p className="text-gray-700">{type.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
