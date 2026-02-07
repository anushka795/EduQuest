import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Play, CheckCircle, Clock } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get(`/student/quizzes/${user.id}`);
                setQuizzes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [user.id]);

    const activeQuizzes = quizzes.filter(q => !q.completed);
    const completedQuizzes = quizzes.filter(q => q.completed);

    if (loading) return <div>Loading quizzes...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-duo-eel tracking-tight">My Quizzes</h1>
                    <p className="text-duo-wolf font-bold mt-1">Quizzes assigned by your teachers</p>
                </div>
            </header>

            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-1 w-12 bg-duo-green rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-duo-eel uppercase tracking-wide">Available Quizzes</h2>
                </div>

                {activeQuizzes.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border-2 border-slate-200">
                        <div className="text-6xl mb-4">🎉</div>
                        <p className="text-duo-wolf font-bold text-lg">No new quizzes available right now. Great job!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeQuizzes.map(quiz => (
                            <div key={quiz.id} className="bg-white rounded-3xl border-2 border-slate-200 shadow-b-4 shadow-slate-200 p-6 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs px-3 py-1 rounded-xl border-2 font-bold uppercase tracking-wider ${quiz.difficulty === 'Easy' ? 'bg-green-100 text-duo-green border-green-200' :
                                            quiz.difficulty === 'Medium' ? 'bg-orange-100 text-duo-fox border-orange-200' :
                                                'bg-red-100 text-duo-cardinal border-red-200'
                                        }`}>
                                        {quiz.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-duo-eel mb-1 leading-tight">{quiz.title}</h3>
                                <p className="text-sm text-duo-macaw font-bold mb-6">{quiz.subject}</p>

                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-6 font-bold">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle size={16} strokeWidth={2.5} />
                                        {quiz.questionCount} Questions
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} strokeWidth={2.5} />
                                        ~{quiz.questionCount * 2} Mins
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <Play size={20} fill="currentColor" /> START
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4 pt-10">
                    <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-slate-400 uppercase tracking-wide">Completed Quizzes</h2>
                </div>

                {completedQuizzes.length === 0 ? (
                    <p className="text-slate-400 font-bold italic ml-4">You haven't completed any quizzes yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedQuizzes.map(quiz => (
                            <div key={quiz.id} className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-6 opacity-75 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-700">{quiz.title}</h3>
                                    <span className="text-lg font-extrabold text-duo-macaw">{quiz.score} Pts</span>
                                </div>
                                <p className="text-sm font-bold text-slate-400 mb-4">{quiz.subject}</p>
                                <div className="pt-4 border-t-2 border-slate-200 text-center">
                                    <span className="text-sm font-bold text-duo-green flex items-center justify-center gap-2 uppercase tracking-wide">
                                        <CheckCircle size={18} strokeWidth={3} /> Completed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
