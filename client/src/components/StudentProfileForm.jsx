import React, { useState } from "react";

export default function StudentProfileForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    
    // Education
    currentEducation: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpa: "",
    
    // Skills & Interests
    technicalSkills: [],
    softSkills: [],
    interests: [],
    languages: [],
    
    // Career Goals
    careerInterests: [],
    preferredIndustries: [],
    salaryExpectation: "",
    workPreferences: [],
    
    // Experience
    internships: [],
    projects: [],
    certifications: [],
    
    // Additional Info
    aboutMe: "",
    linkedinProfile: "",
    githubProfile: "",
    portfolio: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up the data before submission
    const cleanedData = {
      ...formData,
      // Remove empty arrays and convert to proper format
      technicalSkills: formData.technicalSkills.filter(skill => skill.trim() !== ''),
      softSkills: formData.softSkills.filter(skill => skill.trim() !== ''),
      interests: formData.interests.filter(interest => interest.trim() !== ''),
      languages: formData.languages.filter(language => language.trim() !== ''),
      careerInterests: formData.careerInterests.filter(interest => interest.trim() !== ''),
      preferredIndustries: formData.preferredIndustries.filter(industry => industry.trim() !== ''),
      workPreferences: formData.workPreferences.filter(pref => pref.trim() !== ''),
      // Convert empty strings to undefined for optional fields
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      location: formData.location || undefined,
      institution: formData.institution || undefined,
      fieldOfStudy: formData.fieldOfStudy || undefined,
      graduationYear: formData.graduationYear || undefined,
      gpa: formData.gpa || undefined,
      aboutMe: formData.aboutMe || undefined,
      linkedinProfile: formData.linkedinProfile || undefined,
      githubProfile: formData.githubProfile || undefined,
      portfolio: formData.portfolio || undefined
    };
    
    console.log('Submitting form data:', cleanedData);
    onSubmit(cleanedData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Education Level *</label>
        <select
          name="currentEducation"
          value={formData.currentEducation}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select education level</option>
          <option value="high-school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="diploma">Diploma</option>
          <option value="certification">Certification</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            placeholder="University/College name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Year</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
            min="2024"
            max="2030"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GPA (if applicable)</label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            max="4"
            placeholder="e.g., 3.75"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Interests</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
        <input
          type="text"
          value={formData.technicalSkills.join(', ')}
          onChange={(e) => handleArrayInputChange('technicalSkills', e.target.value)}
          placeholder="e.g., JavaScript, Python, React, Machine Learning"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
        <input
          type="text"
          value={formData.softSkills.join(', ')}
          onChange={(e) => handleArrayInputChange('softSkills', e.target.value)}
          placeholder="e.g., Leadership, Communication, Problem Solving"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
        <input
          type="text"
          value={formData.interests.join(', ')}
          onChange={(e) => handleArrayInputChange('interests', e.target.value)}
          placeholder="e.g., AI, Web Development, Data Science"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate interests with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        <input
          type="text"
          value={formData.languages.join(', ')}
          onChange={(e) => handleArrayInputChange('languages', e.target.value)}
          placeholder="e.g., English, Spanish, French"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate languages with commas</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Goals</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Career Interests</label>
        <input
          type="text"
          value={formData.careerInterests.join(', ')}
          onChange={(e) => handleArrayInputChange('careerInterests', e.target.value)}
          placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate career interests with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
        <input
          type="text"
          value={formData.preferredIndustries.join(', ')}
          onChange={(e) => handleArrayInputChange('preferredIndustries', e.target.value)}
          placeholder="e.g., Technology, Healthcare, Finance"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate industries with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
        <select
          name="salaryExpectation"
          value={formData.salaryExpectation}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select salary range</option>
          <option value="30k-50k">$30k - $50k</option>
          <option value="50k-70k">$50k - $70k</option>
          <option value="70k-90k">$70k - $90k</option>
          <option value="90k-110k">$90k - $110k</option>
          <option value="110k+">$110k+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Preferences</label>
        <div className="space-y-2">
          {['Remote', 'Hybrid', 'On-site', 'Flexible'].map((pref) => (
            <label key={pref} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.workPreferences.includes(pref.toLowerCase())}
                onChange={() => handleCheckboxChange('workPreferences', pref.toLowerCase())}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              {pref}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
        <textarea
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleInputChange}
          rows="4"
          placeholder="Tell us about yourself, your goals, and what you're looking for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
          <input
            type="url"
            name="githubProfile"
            value={formData.githubProfile}
            onChange={handleInputChange}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
        <input
          type="url"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleInputChange}
          placeholder="https://yourportfolio.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Help us personalize your experience by providing some information</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
