import { useState, useEffect } from "react";
import {
  Star,
  Quote,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      imgSrc: "/src/assets/testimonials/pic1.jpeg",
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      text: "CareerCompass transformed my career journey completely! The AI-powered recommendations helped me transition from marketing to tech seamlessly. The personalized learning path and mentor connections were game-changers.",
      rating: 5,
      highlight: "Career Switch Success",
    },
    {
      imgSrc: "/src/assets/testimonials/pic2.jpeg",
      name: "Marcus Johnson",
      role: "Product Manager at Microsoft",
      text: "The progress tracking feature kept me motivated throughout my journey. I could see exactly how far I'd come and what skills I needed to develop next. Landed my dream job in just 6 months!",
      rating: 5,
      highlight: "Dream Job Achieved",
    },
    {
      imgSrc: "/src/assets/testimonials/pic3.jpeg",
      name: "Priya Patel",
      role: "Data Scientist at Netflix",
      text: "Amazing platform! The mentor network is incredible - I connected with industry experts who guided me through complex career decisions. The learning resources are top-notch and always up-to-date.",
      rating: 5,
      highlight: "Expert Mentorship",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector("#testimonials");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-bl from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm font-semibold text-gray-700">
            Success Stories
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          What Our{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Community
          </span>{" "}
          Says
        </h2>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
          Join thousands of professionals who've transformed their careers with
          CareerCompass
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              testimonial={testimonial}
              isVisible={isVisible}
              delay={idx * 200}
              isActive={idx === currentSlide}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Success Stories" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "2x", label: "Faster Career Growth" },
            { number: "100+", label: "Partner Companies" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, isVisible, delay, isActive }) {
  return (
    <div
      className={`relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${isActive ? "ring-2 ring-purple-500 scale-105" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Quote decoration */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Profile section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={testimonial.imgSrc}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-left">
          <div className="font-bold text-gray-900 text-lg">
            {testimonial.name}
          </div>
          <div className="text-sm text-gray-600">{testimonial.role}</div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
          </div>
        </div>
      </div>

      {/* Highlight badge */}
      <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-xs font-semibold text-purple-700 mb-4">
        <Heart className="w-3 h-3" />
        {testimonial.highlight}
      </div>

      {/* Testimonial text */}
      <p className="text-gray-700 leading-relaxed italic text-left">
        "{testimonial.text}"
      </p>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 right-4 opacity-20">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
