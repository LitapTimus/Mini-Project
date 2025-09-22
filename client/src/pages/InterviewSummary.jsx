import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InterviewSummary() {
	const { sessionId } = useParams();
	const navigate = useNavigate();
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
			<div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-xl text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Summary</h1>
				<p className="text-gray-600">Session: {sessionId}</p>
				<button onClick={()=>navigate('/dashboard')} className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white">Back to Dashboard</button>
			</div>
		</div>
	);
}


