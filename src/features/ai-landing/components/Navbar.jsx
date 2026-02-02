export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">CareerAI</div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#riasec" className="text-gray-700 hover:text-blue-600 transition">
            How RIASEC Works
          </a>
          <a href="#services" className="text-gray-700 hover:text-blue-600 transition">
            Features
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Success Stories
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">
            Contact
          </a>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Sign In</button>
      </div>
    </nav>
  )
}
