import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const TakeQuiz = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/student/quiz/${id}`).then(res => setQuiz(res.data)).catch(console.error);
    }, [id]);

    if (!quiz) return <div>Loading quiz...</div>;

    const handleAnswer = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestion]: optionIndex });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(curr => curr - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                score++;
            }
        });

        try {
            await api.post('/student/submit', {
                studentId: user.id,
                quizId: quiz.id,
                // answers, // logic to store answers history if needed
                score,
                totalQuestions: quiz.questions.length
            });
            navigate('/student/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const question = quiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.questions.length - 1;
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto py-4 md:py-8 px-4 h-full flex flex-col">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/student/dashboard')} className="text-slate-300 hover:text-slate-400 -ml-2 p-2">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <div className="w-full mx-4 bg-slate-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-duo-green h-full rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-1 right-2 w-8 h-1 bg-white/30 rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-duo-green uppercase tracking-wider">{currentQuestion + 1} / {quiz.questions.length}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-duo-eel mb-12 leading-tight text-center">
                    {question.questionText}
                </h2>

                <div className="space-y-4">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group active:scale-[0.98] ${answers[currentQuestion] === idx
                                ? 'border-duo-macaw bg-blue-50 text-duo-macaw shadow-[inset_0_0_0_1px_#1CB0F6]' // thickened border look
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700 shadow-b-4 shadow-slate-200 active:shadow-none active:translate-y-[4px] hover:border-slate-300'
                                }`}
                        >
                            <span className="font-bold text-lg">{option}</span>
                            {answers[currentQuestion] === idx && (
                                <div className="w-8 h-8 rounded-full bg-duo-macaw text-white flex items-center justify-center border-2 border-blue-400">
                                    <Check size={18} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-12 pt-6 border-t-2 border-slate-100">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold uppercase tracking-wider transition-colors border-2 border-transparent ${currentQuestion === 0
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-400 hover:bg-slate-100'
                        }`}
                >
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                        className="btn-primary"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn-primary px-10"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeQuiz;
