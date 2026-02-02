const testimonials = [
  {
    text: "The RIASEC assessment helped me understand myself better. I discovered I'm an Investigative-Artistic type and found the perfect engineering program that values creativity!",
    author: "Priya Sharma",
    location: "Student, Delhi",
  },
  {
    text: "I was confused between 5 different careers. The O*NET explorer showed me salary trends and job growth. Now I'm pursuing data science with confidence!",
    author: "Arjun Patel",
    location: "Student, Mumbai",
  },
  {
    text: "The college finder saved me months of research. I found 3 amazing colleges that matched my career goals and budget. Highly recommended!",
    author: "Anjali Verma",
    location: "Student, Bangalore",
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Success Stories from Students</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-4">
              <div className="flex text-yellow-500">{"★".repeat(5)}</div>
              <p className="text-gray-700">{testimonial.text}</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
