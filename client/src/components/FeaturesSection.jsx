import { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
  Award,
  Zap,
  Star,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Career Matching",
      description:
        "Our advanced AI analyzes your skills, interests, and goals to recommend perfect career paths tailored just for you.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      stats: "98% accuracy",
      highlight: "Most Popular",
    },
    {
      icon: TrendingUp,
      title: "Real-time Progress Tracking",
      description:
        "Monitor your career journey with detailed analytics, milestone tracking, and personalized insights.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/80",
      stats: "Live insights",
      highlight: "New Feature",
    },
    {
      icon: BookOpen,
      title: "Curated Learning Hub",
      description:
        "Access premium courses, articles, and resources specifically chosen for your career path.",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50/80 to-violet-50/80",
      stats: "2000+ resources",
      highlight: "Premium",
    },
    {
      icon: Users,
      title: "Expert Network Access",
      description:
        "Connect with industry mentors, recruiters, and professionals who can accelerate your success.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50/80 to-red-50/80",
      stats: "100K+ professionals",
      highlight: "Growing Fast",
    },
  ];

  const [activeFeature, setActiveFeature] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleFeatures((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".feature-card");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-bl from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Header with badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Powerful Features
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Succeed
          </span>
        </h2>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
          Comprehensive tools and insights designed to guide your career journey
          from exploration to achievement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isVisible = visibleFeatures.includes(idx);
            const isActive = activeFeature === idx;

            return (
              <div
                key={idx}
                data-index={idx}
                onClick={() => setActiveFeature(isActive ? null : idx)}
                className={`feature-card group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl cursor-pointer text-left transition-all duration-500 hover:-translate-y-2
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                  ${isActive ? "ring-2 ring-blue-500 shadow-2xl scale-105" : ""}
                `}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and highlight badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {feature.highlight}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-600">
                          {feature.stats}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                      <span className="text-sm">Explore Feature</span>
                      <ChevronRight
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          isActive ? "rotate-90" : "group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-gray-500 font-medium">
                        AI-Powered
                      </span>
                    </div>
                  </div>

                  {/* Expandable content */}
                  {isActive && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Award className="h-4 w-4 text-green-600" />
                          <span>Industry-leading technology</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>Used by thousands of professionals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span>Personalized for your goals</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
            <Sparkles className="h-5 w-5" />
            Get Started Today
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
