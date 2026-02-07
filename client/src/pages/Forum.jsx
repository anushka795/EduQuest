import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MessageSquare, ThumbsUp, ThumbsDown, User, CheckCircle, Send } from 'lucide-react';

const Forum = () => {
    const { user } = useAuth();
    const [viewSubject, setViewSubject] = useState(user.subjects?.[0] || user.enrolledSubjects?.[0]?.subject || 'Mathematics');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    // Forms
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newAnswerText, setNewAnswerText] = useState('');

    const subjectsList = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Biology"];

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await api.get(`/questions/${viewSubject}`);
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [viewSubject]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleQuestionClick = async (q) => {
        if (selectedQuestion?.id === q.id) {
            setSelectedQuestion(null); // toggle off
        } else {
            setSelectedQuestion(q);
            // Fetch answers
            try {
                const res = await api.get(`/answers/${q.id}`);
                setAnswers(res.data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('/questions', {
                studentId: user.id,
                subject: viewSubject,
                questionText: newQuestionText
            });
            setNewQuestionText('');
            fetchQuestions();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostAnswer = async (e) => {
        e.preventDefault();
        if (!selectedQuestion) return;
        try {
            const res = await api.post('/answers', {
                questionId: selectedQuestion.id,
                userId: user.id,
                answerText: newAnswerText,
                isTeacher: user.role === 'teacher'
            });
            setAnswers([...answers, { ...res.data, userName: user.name, userRole: user.role }]);
            setNewAnswerText('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleVote = async (answerId, type) => {
        try {
            await api.put(`/answers/${answerId}/${type}`);
            // Update local state optimizingly
            setAnswers(answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, [type === 'upvote' ? 'upvotes' : 'downvotes']: a[type === 'upvote' ? 'upvotes' : 'downvotes'] + 1 };
                }
                return a;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-duo-eel tracking-tight">Q&A Forum</h1>
                    <p className="text-duo-wolf font-bold mt-1">Ask questions, share knowledge, and help others.</p>
                </div>
            </header>

            {/* Subject Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {subjectsList.map(sub => (
                    <button
                        key={sub}
                        onClick={() => { setViewSubject(sub); setSelectedQuestion(null); }}
                        className={`px-6 py-2 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all border-2 shadow-b-4 active:shadow-none active:translate-y-[2px] ${viewSubject === sub
                            ? 'bg-duo-humpback text-white border-transparent shadow-[#1864ab]'
                            : 'bg-white border-slate-200 text-duo-wolf shadow-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {sub}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Questions List */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Ask Question Box */}
                    <div className="bg-white p-6 rounded-3xl shadow-b-4 shadow-slate-200 border-2 border-slate-200">
                        <h3 className="font-extrabold text-duo-eel mb-4 uppercase tracking-wide text-sm">Ask a Question</h3>
                        <form onSubmit={handlePostQuestion}>
                            <textarea
                                className="w-full p-4 bg-duo-polar rounded-2xl border-2 border-slate-200 font-medium text-duo-eel outline-none focus:border-duo-macaw resize-none placeholder:text-slate-400"
                                rows="3"
                                placeholder={`What's your question about ${viewSubject}?`}
                                value={newQuestionText}
                                onChange={e => setNewQuestionText(e.target.value)}
                                required
                            ></textarea>
                            <button className="btn-primary w-full mt-4 text-sm py-2">
                                Post Question
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        {questions.map(q => (
                            <div
                                key={q.id}
                                onClick={() => handleQuestionClick(q)}
                                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${selectedQuestion?.id === q.id
                                    ? 'bg-blue-50 border-duo-macaw shadow-none'
                                    : 'bg-white border-slate-200 shadow-b-4 shadow-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <p className="font-bold text-duo-eel line-clamp-2 leading-snug">{q.questionText}</p>
                                <div className="flex justify-between items-center mt-4 text-xs font-bold text-duo-wolf">
                                    <span>{q.studentName}</span>
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                                        <MessageSquare size={14} /> {q.answersCount || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {questions.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-3xl">
                                <p className="text-duo-wolf font-bold">No questions yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Discussion Area */}
                <div className="lg:col-span-2">
                    {selectedQuestion ? (
                        <div className="bg-white rounded-3xl shadow-b-4 shadow-slate-200 border-2 border-slate-200 flex flex-col h-[600px] overflow-hidden">
                            {/* Question Header */}
                            <div className="p-8 border-b-2 border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-duo-wolf shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-extrabold text-duo-eel">{selectedQuestion.studentName}</p>
                                        <p className="text-xs font-bold text-duo-wolf uppercase tracking-wide">{new Date(selectedQuestion.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-extrabold text-duo-eel leading-tight">{selectedQuestion.questionText}</h2>
                            </div>

                            {/* Answers List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                                {answers.length === 0 ? (
                                    <div className="text-center text-duo-wolf py-12 font-bold opacity-60">
                                        No answers yet. Be the first to help!
                                    </div>
                                ) : (
                                    answers.map(ans => (
                                        <div key={ans.id} className={`flex gap-4 ${ans.isTeacher ? 'bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100' : ''}`}>
                                            <div className="flex flex-col items-center gap-2 pt-1">
                                                <button onClick={() => handleVote(ans.id, 'upvote')} className="text-slate-300 hover:text-duo-macaw transition-colors p-1 hover:bg-blue-50 rounded-lg"><ThumbsUp size={20} strokeWidth={2.5} /></button>
                                                <span className="font-extrabold text-sm text-duo-eel">{ans.upvotes - ans.downvotes}</span>
                                                <button onClick={() => handleVote(ans.id, 'downvote')} className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-lg"><ThumbsDown size={20} strokeWidth={2.5} /></button>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`font-extrabold text-sm ${ans.isTeacher ? 'text-indigo-600' : 'text-duo-eel'}`}>{ans.userName}</span>
                                                    {ans.isTeacher && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg border-b-2 border-indigo-800 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Teacher</span>}
                                                    <span className="text-xs font-bold text-duo-wolf opacity-60">• {new Date(ans.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-duo-eel text-sm font-medium leading-relaxed">{ans.answerText}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Post Answer */}
                            <div className="p-4 border-t-2 border-slate-100 bg-slate-50">
                                <form onSubmit={handlePostAnswer} className="flex gap-3">
                                    <input
                                        type="text"
                                        className="flex-1 px-5 py-3 bg-white rounded-2xl border-2 border-slate-200 focus:border-duo-macaw outline-none font-medium text-duo-eel placeholder:text-slate-400 transition-all shadow-sm"
                                        placeholder="Write a helpful answer..."
                                        value={newAnswerText}
                                        onChange={e => setNewAnswerText(e.target.value)}
                                    />
                                    <button
                                        disabled={!newAnswerText}
                                        className="bg-duo-macaw text-white px-4 rounded-2xl shadow-b-4 shadow-[#1899d6] active:shadow-none active:translate-y-[4px] border-2 border-transparent hover:bg-[#3cbbf7] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all"
                                    >
                                        <Send size={24} strokeWidth={2.5} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
                            <MessageSquare size={64} className="mb-6 opacity-20" />
                            <p className="text-xl font-extrabold text-slate-400">Select a question to view discussion</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forum;
