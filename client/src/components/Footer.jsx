export default function Footer() {
  return (
    <footer className="bg-green-600 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & description */}
        <div>
          <div className="text-xl font-semibold mb-3">🚀 Career Compass</div>
          <p className="text-sm text-green-100">
            Empowering professionals to navigate their career journey with
            confidence. Discover, learn, and achieve your dream career with our
            AI-powered platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-green-100">
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-green-100">
            <li>
              <a href="#" className="hover:underline">
                Career Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Resume Builder
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Interview Prep
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Salary Insights
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <p className="text-sm text-green-100 mb-2">hello@careercompass.com</p>
          <p className="text-sm text-green-100 mb-2">+1 (555) 123-4567</p>
          <p className="text-sm text-green-100 mb-4">San Francisco, CA</p>
          <h4 className="font-semibold mb-2">Stay Updated</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-2 py-1 rounded-l bg-green-50 text-green-900 text-sm w-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-r text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom legal section */}
      <div className="border-t border-green-500 pt-4 mt-4 text-xs text-center text-green-100 space-x-3">
        <span>
          © {new Date().getFullYear()} Career Compass. All rights reserved.
        </span>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <a href="#" className="hover:underline">
          Cookie Policy
        </a>
      </div>
    </footer>
  );
}
