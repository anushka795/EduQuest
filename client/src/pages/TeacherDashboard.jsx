import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Loader2, Save, Wand2 } from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(user.subjects && user.subjects.length > 0 ? user.subjects[0] : '');
    const [difficulty, setDifficulty] = useState('Medium');
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [publishStatus, setPublishStatus] = useState(null); // success/error

    const handleGenerate = async () => {
        if (!textContent) return;
        setLoading(true);
        setGeneratedQuestions([]);
        try {
            const res = await api.post('/teacher/generate-quiz', {
                subject,
                difficulty,
                text: textContent
            });
            setGeneratedQuestions(res.data);
        } catch (err) {
            console.error(err);
            // set error
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            await api.post('/teacher/quiz', {
                teacherId: user.id,
                subject,
                title,
                difficulty,
                questions: generatedQuestions
            });
            setPublishStatus('Quiz published successfully!');
            // Reset form
            setTitle('');
            setTextContent('');
            setGeneratedQuestions([]);
            setTimeout(() => setPublishStatus(null), 3000);
        } catch (err) {
            console.error(err);
            setPublishStatus('Failed to publish quiz.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-extrabold text-duo-eel tracking-tight">Create New Quiz</h1>
                <p className="text-duo-wolf font-medium">Use AI to generate questions from your teaching material.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-b-4 shadow-slate-200 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Quiz Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel placeholder:text-slate-400"
                            placeholder="e.g. Chapter 1 Review"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Subject</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel appearance-none"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                >
                                    {user.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Difficulty</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all font-medium text-duo-eel appearance-none"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-duo-wolf uppercase mb-2 ml-1">Study Material (Text/Notes)</label>
                        <textarea
                            className="w-full h-40 px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none resize-none font-medium text-duo-eel placeholder:text-slate-400"
                            placeholder="Paste your lecture notes, chapter summary, or text here..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                        ></textarea>
                        <p className="text-xs text-duo-wolf mt-2 font-bold ml-1">AI will analyze this text to generate relevant questions.</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !textContent || !title}
                        className={`w-full btn-primary flex items-center justify-center gap-2 ${loading || !textContent || !title ? 'opacity-50 cursor-not-allowed bg-slate-400 border-transparent shadow-none' : ''}`}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={24} />}
                        {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-duo-eel">Quiz Preview</h2>
                        {generatedQuestions.length > 0 && <span className="text-xs bg-blue-100 text-duo-macaw px-3 py-1 rounded-xl font-bold uppercase tracking-wider border-2 border-blue-200">{generatedQuestions.length} Questions</span>}
                    </div>

                    {generatedQuestions.length === 0 ? (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
                            <Wand2 size={48} className="mb-4 opacity-20" />
                            <p className="font-bold text-lg">Generated questions will appear here.</p>
                            <p className="text-sm font-medium">Ready to review and publish.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {generatedQuestions.map((q, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100"></div>
                                    <p className="font-bold text-duo-eel mb-4 mt-2 text-lg">{idx + 1}. {q.questionText}</p>
                                    <div className="space-y-2">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className={`text-sm px-4 py-3 rounded-xl font-medium border-2 ${i === q.correctAnswer ? 'bg-green-100 text-duo-green border-duo-green' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handlePublish}
                                className="w-full bg-duo-green text-white font-bold py-3 px-6 rounded-2xl shadow-b-4 shadow-[#46a302] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-transparent hover:bg-[#46a302] flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Publish Quiz
                            </button>

                            {publishStatus && (
                                <div className={`p-4 rounded-2xl text-center font-bold border-2 ${publishStatus.includes('success') ? 'bg-green-100 text-duo-green border-green-200' : 'bg-red-100 text-red-500 border-red-200'}`}>
                                    {publishStatus}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
