import { CheckCircle } from "lucide-react"

const plans = [
  {
    name: "Explorer",
    price: "Free",
    period: "forever",
    features: [
      "RIASEC personality assessment",
      "Basic career explorer (100+ careers)",
      "Career personality report",
      "Email support",
    ],
    description: "Perfect for exploring career options",
    buttonText: "Start Free",
    isPopular: false,
  },
  {
    name: "Career Seeker",
    price: "299",
    period: "month",
    features: [
      "Full RIASEC assessment with detailed report",
      "Complete O*NET career explorer (1000+ careers)",
      "College finder (500+ Indian colleges)",
      "Personalized career recommendations",
      "Salary & growth insights",
      "Priority email support",
      "Career roadmap generator",
    ],
    description: "Ideal for serious career planning",
    buttonText: "Get Started",
    isPopular: true,
  },
  {
    name: "Premium Plus",
    price: "599",
    period: "month",
    features: [
      "Everything in Career Seeker",
      "1-on-1 career counseling (4 sessions/year)",
      "College application guidance",
      "Skill development roadmap",
      "Interview preparation resources",
      "Priority phone & email support",
      "Lifetime access to all updates",
      "Career transition support",
    ],
    description: "Complete career transformation",
    buttonText: "Contact Sales",
    isPopular: false,
  },
]

export default function PricingSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Career Guidance Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible pricing to support your career journey
            <br />
            All plans include RIASEC assessment and career explorer access
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border-2 p-8 space-y-6 ${
                plan.isPopular ? "border-blue-600 bg-white shadow-lg scale-105" : "border-gray-200 bg-white"
              }`}
            >
              {plan.isPopular && (
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold w-fit">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>
              <div>
                <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.buttonText}
              </button>
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
