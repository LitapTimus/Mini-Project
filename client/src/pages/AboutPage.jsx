import React from "react";
import {
  Target,
  Users,
  Award,
  TrendingUp,
  Heart,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { label: "Users Helped", value: "25,000+", icon: Users },
    { label: "Career Paths", value: "500+", icon: Target },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Years of Experience", value: "8+", icon: TrendingUp },
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "Helping people find careers aligned with their passions.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Leveraging modern tools for smarter career decisions.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Your privacy and safety are always our priority.",
    },
    {
      icon: Zap,
      title: "Excellence",
      description: "Striving to deliver top-notch career guidance.",
    },
  ];

  const team = [
    {
      name: "Sumit Patil",
      role: "backend Developer",
      bio: "Passionate about building scalable systems.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    },
    {
      name:"Kaustubh Rane",
      role: "Frontend Developer",
      bio: "Passionate about building user-friendly interfaces.",
      image:
        "/public/k.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-900 to-green-300 bg-clip-text text-transparent mb-6">
            About Career Compass
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Empowering individuals to explore and thrive in their ideal careers
            through AI-driven guidance and personalized tools.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </section>

        {/* Story Section */}
        <section className="bg-gray-50 rounded-2xl shadow p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Our Story
          </h2>
          <p className="text-gray-900 mb-4 leading-relaxed">
            Career Compass was born from the idea that everyone deserves a
            fulfilling career. What started as a small project quickly grew into
            a powerful      platform used by thousands.
          </p>
          <p className="text-gray-900 leading-relaxed">
            Our goal is simple: use technology to make career discovery smarter,
            faster, and more human.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-400 text-white rounded-2xl p-8 md:p-12 text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            To empower individuals with clarity, confidence, and cutting-edge
            tools to navigate their careers successfully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-700 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition">
              Join Us
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-green-600 transition">
              Learn More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
