import React, { useState, useEffect, useRef } from "react";

const StatCard = ({ target, label, suffix, duration = 2000 }) => {
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
      className="bg-white p-6 rounded-lg shadow text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
    >
      <div className="text-4xl font-bold text-green-600 leading-tight">
        {count.toLocaleString()}
        {count === target && suffix}
      </div>
      <div className="mt-2 text-base font-medium text-gray-700">{label}</div>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section id="stats" className="bg-[#f9fafb] py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <StatCard target={10000} label="Successful Placements" suffix="+" />
          <StatCard target={500} label="Partner Companies" suffix="+" />
          <StatCard target={50000} label="Active Members" suffix="+" />
        </div>
      </div>
    </section>
  );
}
