import React from "react";
import { useParams } from "react-router-dom";

export default function InterviewWorkspace() {
	const { sessionId } = useParams();
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
			<div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-xl text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Session</h1>
				<p className="text-gray-600">Session: {sessionId}</p>
				<p className="text-gray-600 mt-2">Workspace placeholder.</p>
			</div>
		</div>
	);
}


