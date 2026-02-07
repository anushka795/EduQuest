import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, GraduationCap } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(formData.email, formData.password);
        if (res.success) {
            // Redirect based on role not available in return directly unless we parse user again
            // But context updates user. We can use effect or just pull from local storage or wait
            // Better to rely on state change in app.js or just force separate navigation
            // Let's grab user from storage for quick redirect logic here since state update is async
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'teacher') navigate('/teacher/dashboard');
            else navigate('/student/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-duo-snow flex items-center justify-center p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-b-4 shadow-slate-200 overflow-hidden">
                <div className="p-8 text-center border-b-2 border-slate-100">
                    <h2 className="text-3xl font-extrabold text-duo-eel mb-2">Welcome Back</h2>
                    <p className="text-duo-wolf font-bold uppercase tracking-wide text-sm">Sign in to EduQuest</p>
                </div>
                <div className="p-8 pt-6">
                    {error && (
                        <div className="bg-red-100 border-2 border-red-200 text-red-600 p-3 rounded-2xl mb-6 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all placeholder:text-slate-400 font-medium text-duo-eel"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-2xl bg-duo-polar border-2 border-slate-200 focus:border-duo-macaw focus:ring-0 outline-none transition-all placeholder:text-slate-400 font-medium text-duo-eel"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="btn-primary w-full"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Don't have an account? <Link to="/register" className="text-duo-macaw hover:text-duo-macaw/80 hover:underline">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
