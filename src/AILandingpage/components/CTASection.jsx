import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to discover your ideal career?</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2">
              Start Free Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
