import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="relative py-20 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">CareerAI</h3>
              <p className="text-gray-400 leading-relaxed">
                Empowering Indian students with AI-driven career guidance and personalized pathways to success.
              </p>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-3">
              {["RIASEC Assessment", "Career Explorer", "College Finder", "Recommendations", "Career Analytics"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "#" },
                { name: "How RIASEC Works", href: "#riasec" },
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:hello@careerai.com" className="hover:text-white transition-colors duration-300">
                  hello@careerai.com
                </a>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+919876543210" className="hover:text-white transition-colors duration-300">
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-center lg:text-left">© 2025 CareerAI. All rights reserved.</p>

            <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
