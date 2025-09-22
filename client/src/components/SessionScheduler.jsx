import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, X } from 'lucide-react';
import MentorService from '../services/mentorService';
import { studentService } from '../services/studentService';

const SessionScheduler = ({ onClose, onSessionScheduled }) => {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: 60,
        type: 'video',
        topic: '',
        description: '',
        studentId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [domain, setDomain] = useState('');

    React.useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const studentsList = await MentorService.getMentorStudents();
            setStudents(studentsList);
        } catch (err) {
            setError('Failed to load students');
        }
    };

    const loadMentors = async (selectedDomain) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const qs = selectedDomain ? `?domain=${encodeURIComponent(selectedDomain)}` : '';
            const res = await fetch(`${baseUrl}/mentors${qs}`, { credentials: 'include' });
            const data = await res.json();
            setMentors(Array.isArray(data) ? data : []);
        } catch (_e) {
            setMentors([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            const selectedRole = localStorage.getItem('selectedRole');
            const role = selectedRole || stored.role;
            const scheduledTime = `${formData.date}T${formData.startTime}`;

            let scheduledSession;
            if (role === 'student') {
                // As student, we need mentorId
                if (!formData.mentorId) throw new Error('Please select a mentor');
                scheduledSession = await studentService.createSession({
                    mentorId: formData.mentorId,
                    scheduledTime,
                    duration: formData.duration,
                    type: formData.type,
                    topic: formData.topic,
                    description: formData.description
                });
            } else {
                // As mentor, existing flow
                scheduledSession = await MentorService.createSession({
                    ...formData,
                    scheduledTime
                });
            }
            onSessionScheduled(scheduledSession);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to schedule session');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Schedule New Session</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {(() => {
                        const stored = JSON.parse(localStorage.getItem('user') || '{}');
                        const selectedRole = localStorage.getItem('selectedRole');
                        const role = selectedRole || stored.role;
                        if (role === 'mentor') {
                            return (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student</label>
                                    <select
                                        value={formData.studentId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="">Select a student</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }
                        // Student role: pick domain, then mentor
                        return (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Domain</label>
                                    <input
                                        type="text"
                                        value={domain}
                                        onChange={(e) => { setDomain(e.target.value); loadMentors(e.target.value); }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        placeholder="e.g., Web Development, Data Science"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mentor</label>
                                    <select
                                        value={formData.mentorId || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, mentorId: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="">Select a mentor</option>
                                        {mentors.map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name} — {m.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        );
                    })()}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <div className="mt-1 relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <div className="mt-1 relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Session Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="video">Video Call</option>
                            <option value="audio">Audio Call</option>
                            <option value="chat">Chat</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Topic</label>
                        <input
                            type="text"
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                            placeholder="e.g., Career Planning Discussion"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Brief description of what will be covered..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SessionScheduler;