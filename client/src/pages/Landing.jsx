import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-duo-snow text-duo-eel overflow-x-hidden relative font-sans">
            {/* Background Texture/Pattern - Simple dots or subtle shapes often used by Duolingo */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

            <nav className="relative z-10 flex justify-between items-center px-6 md:px-10 py-6 max-w-7xl mx-auto">
                <div className="text-3xl font-extrabold tracking-tighter text-duo-green flex items-center gap-2">
                    <div className="w-8 h-8 bg-duo-green rounded-lg rotate-3"></div>
                    EduQuest
                </div>
                <div className="space-x-4 flex items-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-secondary hidden md:block text-sm py-2 px-6 uppercase tracking-widest"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn-primary text-sm py-2 px-6 uppercase tracking-widest"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-duo-eel">
                            The free, fun, and effective way to <span className="text-duo-green">learn anything!</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-duo-wolf max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
                    >
                        Experience the next generation of learning with AI-generated quizzes, real-time analytics, and a collaborative community.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-primary text-xl py-4 px-10 w-full sm:w-auto"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="flex-1 w-full max-w-md"
                >
                    {/* Floating Card Container */}
                    <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-b-4 shadow-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="bg-duo-macaw p-4 rounded-2xl shadow-b-4 shadow-[#1899d6] text-white">
                                    <Zap size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-duo-eel">AI Generated</h3>
                                    <p className="text-sm text-duo-wolf font-bold uppercase tracking-wider">Fast & Unique</p>
                                </div>
                            </div>

                            <div className="h-0.5 bg-slate-100 w-full"></div>

                            <div className="flex items-center gap-6">
                                <div className="bg-duo-fox p-4 rounded-2xl shadow-b-4 shadow-[#e58700] text-white">
                                    <CheckCircle size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-duo-eel">Instant Feedback</h3>
                                    <p className="text-sm text-duo-wolf font-bold uppercase tracking-wider">Track Progress</p>
                                </div>
                            </div>

                            <div className="h-0.5 bg-slate-100 w-full"></div>

                            <div className="p-6 bg-duo-primary/10 rounded-2xl border-2 border-duo-green/20 text-center">
                                <p className="font-extrabold text-2xl text-duo-green tracking-widest uppercase">Join the fun</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Landing;
