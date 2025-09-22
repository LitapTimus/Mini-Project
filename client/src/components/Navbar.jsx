import { Link } from "react-router-dom";
import { useState } from "react";
import { Compass, Menu, X, ChevronRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                <Compass className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Career Compass
              </span>
              <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Navigate Your Future
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8">
              <a
                href="#features"
                className="relative text-gray-700 hover:text-green-600 font-medium transition-all duration-300 group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#testimonials"
                className="relative text-gray-700 hover:text-green-600 font-medium transition-all duration-300 group"
              >
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className="relative text-gray-700 hover:text-green-600 font-medium transition-all duration-300 group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Enhanced CTA Button */}
            <Link
              to="/role-selection"
              className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get Started
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Contact
              </a>
              <Link
                to="/role-selection"
                className="block bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold text-center shadow-lg mt-4"
                onClick={toggleMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
