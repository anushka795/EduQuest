import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, User, Mail, GraduationCap, CheckCircle, Clock, Award, BarChart3 } from 'lucide-react';

const TeacherStudentDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/teacher/student-details/${user.id}/${id}`);
                setStudentData(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load student details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [user.id, id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duo-green"></div>
        </div>
    );

    if (error || !studentData) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-duo-macaw font-bold hover:underline">Go Back</button>
        </div>
    );

    const { student, results } = studentData;
    const averageScore = results.length > 0
        ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length)
        : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-duo-eel font-bold transition-colors"
            >
                <ArrowLeft size={20} /> Back to Students
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-b-4 shadow-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-duo-polar border-4 border-slate-100 flex items-center justify-center text-duo-macaw shadow-inner">
                    <User size={48} />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-extrabold text-duo-eel mb-2">{student.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <Mail size={16} /> {student.email}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                            <GraduationCap size={16} /> Student
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 min-w-[100px]">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">Avg Score</p>
                        <p className={`text-3xl font-extrabold ${averageScore >= 80 ? 'text-green-500' : averageScore >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                            {averageScore}%
                        </p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 min-w-[100px]">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1">Quizzes</p>
                        <p className="text-3xl font-extrabold text-indigo-600">{results.length}</p>
                    </div>
                </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-duo-eel flex items-center gap-2">
                    <BarChart3 className="text-duo-macaw" /> Quiz Performance
                </h2>

                {results.length === 0 ? (
                    <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-300">
                        <p className="text-slate-400 font-bold text-lg">No quizzes completed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((result) => (
                            <div key={result.id} className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-duo-macaw transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-duo-eel group-hover:text-duo-macaw transition-colors">
                                            {result.quizTitle}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">
                                            {new Date(result.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-extrabold text-xl ${result.percentage >= 80 ? 'bg-green-100 text-duo-green' :
                                            result.percentage >= 60 ? 'bg-orange-100 text-orange-600' :
                                                'bg-red-100 text-red-600'
                                        }`}>
                                        {result.percentage}%
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" />
                                        {result.score} / {result.totalQuestions} Correct
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <Award size={16} className="text-yellow-500" />
                                        {result.score * 10} XP Earned
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherStudentDetails;
