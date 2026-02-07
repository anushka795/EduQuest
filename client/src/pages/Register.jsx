import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Check, User, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Steps: 'role', 'details', 'subjects' (for students)
    const [step, setStep] = useState('role');
    const [role, setRole] = useState(null); // 'student' or 'teacher'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        subjects: [], // For teachers (teaching)
        enrolledSubjects: [] // For students (learning: {subject, teacherId})
    });
    const [availableTeachers, setAvailableTeachers] = useState([]);
    const [error, setError] = useState('');

    const subjectsList = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Biology"];

    useEffect(() => {
        if (role === 'student') {
            // Fetch teachers when student role selected
            api.get('/auth/teachers').then(res => setAvailableTeachers(res.data)).catch(console.error);
        }
    }, [role]);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep('details');
        setFormData({ ...formData, role: selectedRole }); // Initialize role in data
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (role === 'teacher') {
            // Check if subjects selected? simpler to just submit or add step
            // Let's make teacher select subjects in same form or next step.
            // Requirement says "Multi-select checkbox for subjects they teach"
            if (formData.subjects.length === 0) {
                setError("Please select at least one subject you teach.");
                return;
            }
            doRegister();
        } else {
            // Student needs to pick subjects
            setStep('subjects');
        }
    };

    const doRegister = async () => {
        const res = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: role,
            subjects: formData.subjects,
            enrolledSubjects: formData.enrolledSubjects
        });

        if (res.success) {
            navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
        } else {
            setError(res.message);
        }
    };

    const toggleSubject = (sub) => {
        const current = formData.subjects;
        if (current.includes(sub)) {
            setFormData({ ...formData, subjects: current.filter(s => s !== sub) });
        } else {
            setFormData({ ...formData, subjects: [...current, sub] });
        }
    };

    const handleStudentSubjectSelection = (subject, teacherId) => {
        // Validation: one teacher per subject
        const current = formData.enrolledSubjects.filter(En => En.subject !== subject);
        if (teacherId) {
            current.push({ subject, teacherId: parseInt(teacherId) });
        }
        setFormData({ ...formData, enrolledSubjects: current });
    };

    return (
        <div className="min-h-screen bg-duo-snow flex items-center justify-center p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200 shadow-b-4 shadow-slate-200 overflow-hidden">
                <div className="p-8 text-center border-b-2 border-slate-100">
                    <h2 className="text-3xl font-extrabold text-duo-eel mb-2">Create Account</h2>
                    <p className="text-duo-wolf font-bold uppercase tracking-wide text-sm">Join EduQuest as a Student or Teacher</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-100 border-2 border-red-200 text-red-600 p-3 rounded-2xl mb-6 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    {step === 'role' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleRoleSelect('student')}
                                className="group p-8 border-2 border-slate-200 rounded-2xl hover:border-duo-macaw hover:bg-blue-50 transition-all text-center relative top-0 hover:-top-1 active:top-0 shadow-sm hover:shadow-b-4 hover:shadow-slate-200"
                            >
                                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 text-duo-macaw transition-colors">
                                    <User size={40} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-extrabold text-duo-eel uppercase tracking-wide">I am a Student</h3>
                                <p className="text-sm text-duo-wolf mt-2 font-medium">I want to learn, take quizzes, and track progress.</p>
                            </button>
                            <button
                                onClick={() => handleRoleSelect('teacher')}
                                className="group p-8 border-2 border-slate-200 rounded-2xl hover:border-duo-green hover:bg-green-50 transition-all text-center relative top-0 hover:-top-1 active:top-0 shadow-sm hover:shadow-b-4 hover:shadow-slate-200"
                            >
                                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 text-duo-green transition-colors">
                                    <GraduationCap size={40} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-extrabold text-duo-eel uppercase tracking-wide">I am a Teacher</h3>
                                <p className="text-sm text-duo-wolf mt-2 font-medium">I want to create quizzes and manage students.</p>
                            </button>
                        </div>
                    )}

                    {step === 'details' && (
                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Full Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Email</label>
                                    <input required type="email" className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Password</label>
                                    <input required type="password" className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Confirm Password</label>
                                    <input required type="password" className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel"
                                        value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                                </div>
                            </div>

                            {role === 'teacher' && (
                                <div className="mt-6">
                                    <label className="block text-xs font-bold text-duo-wolf uppercase mb-3 ml-1">Subjects you teach:</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {subjectsList.map(sub => (
                                            <div key={sub}
                                                onClick={() => toggleSubject(sub)}
                                                className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-sm font-bold flex items-center gap-3 transition-all ${formData.subjects.includes(sub) ? 'bg-blue-50 border-duo-macaw text-duo-macaw' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.subjects.includes(sub) ? 'bg-duo-macaw border-duo-macaw' : 'border-slate-300'}`}>
                                                    {formData.subjects.includes(sub) && <Check size={14} className="text-white bg-duo-macaw" />}
                                                </div>
                                                {sub}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setStep('role')} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider text-sm transition-colors">Back</button>
                                <button type="submit" className="flex-1 btn-primary">
                                    {role === 'teacher' ? 'Create Account' : 'Next Step'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'subjects' && role === 'student' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-extrabold text-duo-eel">Select Teachers for Subjects</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {subjectsList.map(sub => {
                                    // Find teachers for this subject
                                    const teachersForSub = availableTeachers.filter(t => t.subjects.includes(sub));

                                    return (
                                        <div key={sub} className="p-5 border-2 border-slate-200 rounded-2xl bg-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-duo-eel text-lg">{sub}</span>
                                                {teachersForSub.length === 0 && <span className="text-xs font-bold text-duo-fox bg-orange-50 px-2 py-1 rounded-lg">No teachers available</span>}
                                            </div>

                                            <select
                                                className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-duo-macaw outline-none text-sm font-medium bg-duo-polar text-duo-eel"
                                                onChange={(e) => handleStudentSubjectSelection(sub, e.target.value)}
                                                defaultValue=""
                                                disabled={teachersForSub.length === 0}
                                            >
                                                <option value="" disabled>Select a teacher...</option>
                                                {teachersForSub.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setStep('details')} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider text-sm transition-colors">Back</button>
                                <button
                                    onClick={doRegister}
                                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={formData.enrolledSubjects.length === 0}
                                >
                                    Create Account
                                </button>
                            </div>
                            {formData.enrolledSubjects.length === 0 && (
                                <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-wide">Please enroll in at least one subject</p>
                            )}
                        </div>
                    )}

                    <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Already have an account? <Link to="/login" className="text-duo-macaw hover:text-duo-macaw/80 hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
