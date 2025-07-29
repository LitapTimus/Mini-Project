export default function Navbar(){
    return (
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2 text=xl font-semibold text-green-500">
          🚀 Career Compass
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-black font-medium">
            <a href="#features" className="hover:text-green-600">
              Features
            </a>
            <a href="#testimonials" className="hover:text-green-600">
              Testimonials
            </a>
            <a href="#about" className="hover:text-green-600">
              About
            </a>
            <a href="#contact" className="hover:text-green-600">
              Contact Us
            </a>
          </nav>
          <button className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-900 transition">
            Get Started
          </button>
        </div>
      </header>
    );
}