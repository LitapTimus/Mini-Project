import { useState, useEffect } from "react";
import {
  FiTarget,
  FiTrendingUp,
  FiBookOpen,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";

export default function FeaturesSection() {
  const features = [
    {
      icon: FiTarget,
      title: "Personalized Career Matching",
      description:
        "AI-powered recommendations based on your skills, interests, and goals.",
      color: "from-blue-500 to-blue-600",
      stats: "98% accuracy",
    },
    {
      icon: FiTrendingUp,
      title: "Progress Tracking",
      description: "Track your journey with detailed analytics & goal tools.",
      color: "from-cyan-500 to-cyan-600",
      stats: "Real-time insights",
    },
    {
      icon: FiBookOpen,
      title: "Learning Resources",
      description: "Access curated courses and articles tailored to you.",
      color: "from-purple-500 to-purple-600",
      stats: "1000+ resources",
    },
    {
      icon: FiUsers,
      title: "Connect with Mentors & Recruiters",
      description: "Build networks to accelerate your career.",
      color: "from-green-500 to-green-600",
      stats: "50K+ professionals",
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
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Everything You Need to <span className="text-green-600">Succeed</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Tools and insights to guide your career journey.
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
                onClick={() => setActiveFeature(idx)}
                className={`feature-card bg-white rounded-xl p-6 shadow hover:shadow-md cursor-pointer text-left transition duration-500
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                  ${isActive ? "ring-2 ring-green-500" : ""}
                `}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                <div className="flex items-center text-blue-600 mt-3 font-medium">
                  <span>Learn more</span>
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
