const steps = [
  {
    number: "1",
    title: "Take Assessment",
    description: "Complete our RIASEC personality assessment in 15 minutes",
  },
  {
    number: "2",
    title: "Explore Careers",
    description: "Discover matching careers with detailed O*NET data and insights",
  },
  {
    number: "3",
    title: "Find Colleges",
    description: "Search colleges in India that offer your chosen programs",
  },
  {
    number: "4",
    title: "Plan & Succeed",
    description: "Get personalized roadmap and guidance to achieve your goals",
  },
]

export default function ProcessSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Career Journey in 4 Steps</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">From assessment to career success</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center space-y-6">
              <div className="h-20 w-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
