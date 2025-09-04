import React, { useState } from "react";

export default function AssessmentTest() {
  const questions = [
    {
      id: 1,
      question: "Which subject do you enjoy the most?",
      options: ["Math", "Biology", "History", "Art"],
    },
    {
      id: 2,
      question: "Which activity sounds most appealing to you?",
      options: [
        "Solving puzzles",
        "Helping people",
        "Creating something new",
        "Researching topics",
      ],
    },
    {
      id: 3,
      question: "What type of work environment do you prefer?",
      options: [
        "Office with structured tasks",
        "Outdoor or on-field work",
        "Creative and flexible space",
        "Lab or technical setup",
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions.");
      return;
    }
    setSubmitted(true);
  };

  const getResult = () => {
    const values = Object.values(answers);
    if (values.includes("Math"))
      return "You may excel in Engineering or Finance.";
    if (values.includes("Biology"))
      return "You might enjoy Medicine or Research.";
    if (values.includes("Art"))
      return "Creative fields like Design may suit you.";
    return "Explore different fields and build on your strengths.";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Logout button */}
      <button
        onClick={() => (window.location.href = "http://localhost:3000/logout")}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-600 text-center">
          Career Assessment Test
        </h1>

        {!submitted ? (
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {q.question}
                </h3>
                <div className="space-y-1">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={option}
                        onChange={() => handleOptionChange(q.id, option)}
                        checked={answers[q.id] === option}
                        className="accent-green-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Submit Answers
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Suggested Path:
            </h2>
            <p className="text-green-600 font-medium text-lg">{getResult()}</p>

            <button
              className="mt-6 text-sm text-blue-500 hover:underline"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              Retake Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
