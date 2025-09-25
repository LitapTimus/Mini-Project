import {
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Zap,
  Shield,
  Award,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-bl from-blue-600/10 to-green-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand & description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  CareerCompass
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Empowering professionals to navigate their career journey with
                confidence. Discover, learn, and achieve your dream career with
                our AI-powered platform.
              </p>

              {/* Social links */}
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
                  { icon: Github, href: "#", color: "hover:text-gray-400" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center transition-all hover:bg-gray-700 hover:scale-110 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-400" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  "About Us",
                  "Features",
                  "Pricing",
                  "Success Stories",
                  "Career Blog",
                  "Help Center",
                ].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Resources
              </h4>
              <ul className="space-y-4">
                {[
                  "Career Guide",
                  "Resume Builder",
                  "Interview Prep",
                  "Salary Insights",
                  "Skill Assessment",
                  "Industry Reports",
                ].map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Stay Connected
              </h4>

              {/* Contact info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span>hello@careercompass.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Newsletter signup */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h5 className="font-semibold mb-3">Get Career Tips</h5>
                <p className="text-sm text-gray-400 mb-4">
                  Join 50K+ professionals getting weekly insights
                </p>
                <form className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="text-center mb-8">
              <p className="text-gray-400 mb-4">Trusted by professionals at</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                {/* Company logos would go here */}
                <div className="text-gray-500 font-semibold">Google</div>
                <div className="text-gray-500 font-semibold">Microsoft</div>
                <div className="text-gray-500 font-semibold">Netflix</div>
                <div className="text-gray-500 font-semibold">Tesla</div>
              </div>
            </div>
          </div>

          {/* Bottom legal section */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">
                © {new Date().getFullYear()} CareerCompass. Made with love in
                San Francisco.
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
