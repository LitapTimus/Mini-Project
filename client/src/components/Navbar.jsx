import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* Logo section */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.svg" // Or .png if you're using an image
          alt="Career Compass Logo"
          className="h-8 w-auto"
        />
        <span className="text-xl font-semibold text-green-600 hidden sm:inline">
          Career Compass
        </span>
      </div>

      {/* Navigation and button */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-6 text-black font-medium">
          <a href="#features" className="hover:text-green-600">
            Features
          </a>
          <a href="#testimonials" className="hover:text-green-600">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-green-600">
            Contact Us
          </a>
        </nav>
        <Link
          to="/role-selection"
          className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-900 transition"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}