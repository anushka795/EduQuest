import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Users, MessageSquare, PieChart, PenTool } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null; // Should be protected by route but just in case

    const teacherLinks = [
        { path: '/teacher/dashboard', label: 'Create Quiz', icon: <PenTool size={20} /> },
        { path: '/teacher/students', label: 'My Students', icon: <Users size={20} /> },
        { path: '/teacher/forum', label: 'Q&A Forum', icon: <MessageSquare size={20} /> },
    ];

    const studentLinks = [
        { path: '/student/dashboard', label: 'My Quizzes', icon: <BookOpen size={20} /> },
        { path: '/student/performance', label: 'My Performance', icon: <PieChart size={20} /> },
        { path: '/student/forum', label: 'Q&A Forum', icon: <MessageSquare size={20} /> },
    ];

    const links = user.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="flex h-screen bg-duo-snow font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r-2 border-slate-200 flex flex-col z-20 hidden md:flex">
                <div className="p-6 md:p-8">
                    <h1 className="text-3xl font-extrabold text-duo-green tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                        EduQuest
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all border-2 ${location.pathname === link.path
                                ? 'bg-blue-50 border-duo-macaw text-duo-macaw'
                                : 'border-transparent text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {/* Allow icon to take current text color */}
                            <span className={location.pathname === link.path ? 'text-duo-macaw' : 'text-slate-400'}>
                                {link.icon}
                            </span>
                            <span className="font-bold uppercase tracking-widest text-sm">{link.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 m-4 border-t-2 border-slate-100">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-duo-eel truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate font-bold uppercase">{user.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header (simplified) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b-2 border-slate-200 z-50 px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-duo-green tracking-tighter">EduQuest</h1>
                <button onClick={handleLogout} className="text-slate-400"><LogOut /></button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto md:pt-0 pt-16">
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {/* Mobile Logout/Nav could be improved here but sticking to layout param */}
                    <div className="flex justify-end mb-4 md:block hidden">
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-duo-cardinal font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
