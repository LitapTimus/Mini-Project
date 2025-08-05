import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // 👈 Import navigate hook

export default function HeroSection() {
  const navigate = useNavigate(); // 👈 Use the hook

  return (
    <section className="bg-[#f9fafb] py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 text-gray-900">
          Navigate Your <span className="text-green-600">Career journey</span>{" "}
          with Confidence
        </h1>
        <p className="text-gray-600 mb-4">
          Discover personalized career paths, track your progress, and unlock
          opportunities with our AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/login-options")}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-orange-600 transition"
          >
            Start Your Journey <FiArrowRight className="w-4 h-4" />
          </button>

          <button className="bg-white text-gray-800 px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
            Explore Careers
          </button>
        </div>
      </div>
    </section>
  );
}
