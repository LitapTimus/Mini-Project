import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";

export default function ExploreCareer() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState("");

  // Career options with detailed information
  const careers = {
    "software-engineer": {
      title: "Software Engineer",
      description: "Software engineers design, develop, and maintain software systems and applications.",
      skills: ["Programming", "Problem Solving", "Algorithms", "Data Structures", "Software Design"],
      education: "Bachelor's degree in Computer Science, Software Engineering, or related field",
      salary: "$70,000 - $150,000 per year",
      outlook: "Excellent job growth expected over the next decade",
      paths: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "DevOps Engineer"],
    },
    "data-scientist": {
      title: "Data Scientist",
      description: "Data scientists analyze and interpret complex data to help organizations make better decisions.",
      skills: ["Statistics", "Machine Learning", "Data Analysis", "Programming (Python/R)", "Data Visualization"],
      education: "Master's or PhD in Data Science, Statistics, Computer Science, or related field",
      salary: "$90,000 - $160,000 per year",
      outlook: "Very high demand with continued growth expected",
      paths: ["Machine Learning Engineer", "Data Analyst", "Business Intelligence Analyst", "Research Scientist"],
    },
    "ux-designer": {
      title: "UX Designer",
      description: "UX designers create meaningful and relevant experiences for users interacting with products and services.",
      skills: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing"],
      education: "Bachelor's degree in Design, HCI, or related field",
      salary: "$65,000 - $130,000 per year",
      outlook: "Growing demand as companies focus more on user experience",
      paths: ["UI Designer", "Product Designer", "Interaction Designer", "UX Researcher", "Information Architect"],
    },
    "cybersecurity-analyst": {
      title: "Cybersecurity Analyst",
      description: "Cybersecurity analysts protect computer systems and networks from security breaches and attacks.",
      skills: ["Network Security", "Threat Analysis", "Security Tools", "Risk Assessment", "Incident Response"],
      education: "Bachelor's degree in Cybersecurity, Computer Science, or related field",
      salary: "$75,000 - $140,000 per year",
      outlook: "High demand due to increasing cyber threats",
      paths: ["Security Engineer", "Penetration Tester", "Security Architect", "Security Consultant"],
    },
    "product-manager": {
      title: "Product Manager",
      description: "Product managers oversee the development and success of products throughout their lifecycle.",
      skills: ["Strategic Thinking", "Market Research", "Communication", "Project Management", "Data Analysis"],
      education: "Bachelor's degree in Business, Computer Science, or related field",
      salary: "$80,000 - $150,000 per year",
      outlook: "Strong demand across industries",
      paths: ["Technical Product Manager", "Growth Product Manager", "Product Marketing Manager"],
    }
  };

  const handleCareerChange = (e) => {
    setSelectedCareer(e.target.value);
  };

  const careerInfo = selectedCareer ? careers[selectedCareer] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Careers</h1>
          </div>
        </div>

        {/* Career Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Career Path</h2>
          <select
            value={selectedCareer}
            onChange={handleCareerChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm text-gray-800"
          >
            <option value="">-- Select a career --</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="ux-designer">UX Designer</option>
            <option value="cybersecurity-analyst">Cybersecurity Analyst</option>
            <option value="product-manager">Product Manager</option>
          </select>
        </div>

        {/* Career Information */}
        {careerInfo && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{careerInfo.title}</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 text-lg">{careerInfo.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Key Skills</h3>
                <ul className="list-disc list-inside space-y-1">
                  {careerInfo.skills.map((skill, index) => (
                    <li key={index} className="text-gray-700">{skill}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Education</h3>
                <p className="text-gray-700">{careerInfo.education}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">Salary Range</h3>
                <p className="text-gray-700 text-lg font-medium">{careerInfo.salary}</p>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-2">Job Outlook</h3>
                <p className="text-gray-700">{careerInfo.outlook}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Career Paths</h3>
              <div className="flex flex-wrap gap-2">
                {careerInfo.paths.map((path, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {path}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}