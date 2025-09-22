import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  Award,
  Sparkles,
  Target,
} from "lucide-react";

const StatCard = ({
  target,
  label,
  suffix,
  duration = 2000,
  icon: Icon,
  gradient,
  description,
}) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = parseInt(target, 10);
          if (start === end) return;

          const increment = Math.max(Math.floor(end / (duration / 15)), 1);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 15);

          observer.unobserve(cardRef.current);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = cardRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect();
    };
  }, [target, duration]);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      ></div>

      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
        <Sparkles className="h-6 w-6 text-blue-500" />
      </div>

      {/* Icon */}
      <div
        className={`relative mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient}`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Number */}
      <div className="relative">
        <div
          className={`text-5xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent leading-tight mb-2`}
        >
          {count.toLocaleString()}
          {count === target && suffix}
        </div>

        {/* Label */}
        <div className="text-xl font-semibold text-gray-800 mb-3">{label}</div>

        {/* Description */}
        <div className="text-sm text-gray-600 leading-relaxed">
          {description}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Our Impact
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Empowering Career
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Success
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their careers
            with our AI-powered platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <StatCard
            target={15000}
            label="Career Transformations"
            suffix="+"
            icon={Award}
            gradient="from-green-500 to-emerald-600"
            description="Successful career transitions and job placements across diverse industries"
          />

          <StatCard
            target={850}
            label="Trusted Partners"
            suffix="+"
            icon={Building2}
            gradient="from-blue-500 to-indigo-600"
            description="Leading companies and organizations actively recruiting from our platform"
          />

          <StatCard
            target={75000}
            label="Active Community"
            suffix="+"
            icon={Users}
            gradient="from-purple-500 to-pink-600"
            description="Engaged professionals, mentors, and recruiters building meaningful connections"
          />
        </div>

        {/* Additional CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>Growing by 500+ new members every month</span>
          </div>
        </div>
      </div>
    </section>
  );
}
