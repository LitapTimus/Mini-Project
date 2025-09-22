import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-whiteoverflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-bl from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center min-h-screen py-10">
          {/* Trust indicators */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Trusted by 75,000+ professionals
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Navigate Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text  text-transparent">
                  Career Journey
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-green-200 to-blue-200 -skew-x-12 opacity-30"></div>
              </span>{" "}
              with Confidence
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover personalized career paths, track your progress, and
              unlock opportunities with our{" "}
              <span className="font-semibold text-gray-900">
                AI-powered platform
              </span>
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                98% Accuracy Rate
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Personalized Matching
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Expert Mentorship
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button
              onClick={() => navigate("/role-selection")}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                <Play className="h-4 w-4 text-gray-600" />
              </div>
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
    </section>
  );
}
