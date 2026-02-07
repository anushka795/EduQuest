import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

const StudentPerformance = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);

    useEffect(() => {
        api.get(`/student/results/${user.id}`).then(res => setResults(res.data)).catch(console.error);
    }, [user.id]);

    // Calculate aggregated stats
    const averageScore = results.length > 0
        ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length)
        : 0;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-duo-eel tracking-tight">My Performance</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-duo-macaw rounded-3xl p-6 text-white shadow-b-4 shadow-[#1899d6] border-2 border-transparent">
                    <div className="flex items-center gap-4 mb-2 opacity-90">
                        <Trophy size={24} strokeWidth={2.5} />
                        <span className="font-bold uppercase tracking-wide text-sm">Average Score</span>
                    </div>
                    <div className="text-5xl font-extrabold">{averageScore}%</div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-b-4 shadow-slate-200 border-2 border-slate-200">
                    <div className="flex items-center gap-4 mb-2 text-duo-wolf">
                        <TrendingUp size={24} strokeWidth={2.5} />
                        <span className="font-bold uppercase tracking-wide text-sm">Quizzes Taken</span>
                    </div>
                    <div className="text-5xl font-extrabold text-duo-eel">{results.length}</div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-b-4 shadow-slate-200 border-2 border-slate-200">
                    <div className="flex items-center gap-4 mb-2 text-duo-wolf">
                        <Calendar size={24} strokeWidth={2.5} />
                        <span className="font-bold uppercase tracking-wide text-sm">Latest Grade</span>
                    </div>
                    <div className="text-5xl font-extrabold text-duo-eel">{results[results.length - 1]?.grade || '-'}</div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden">
                <div className="p-6 border-b-2 border-slate-100"><h3 className="font-extrabold text-xl text-duo-eel">History</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b-2 border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-duo-wolf font-bold uppercase text-xs tracking-wider">Quiz Title</th>
                                <th className="px-6 py-4 text-duo-wolf font-bold uppercase text-xs tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-duo-wolf font-bold uppercase text-xs tracking-wider">Date</th>
                                <th className="px-6 py-4 text-duo-wolf font-bold uppercase text-xs tracking-wider">Score</th>
                                <th className="px-6 py-4 text-duo-wolf font-bold uppercase text-xs tracking-wider">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-50">
                            {results.map((res, i) => (
                                <tr key={i} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-duo-eel">{res.quizTitle}</td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{res.subject}</td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{new Date(res.completedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-extrabold text-duo-macaw">{res.percentage}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide border-2 ${res.grade === 'A' ? 'bg-green-100 text-duo-green border-green-200' :
                                            res.grade === 'B' ? 'bg-blue-100 text-duo-macaw border-blue-200' :
                                                res.grade === 'C' ? 'bg-orange-100 text-duo-fox border-orange-200' :
                                                    'bg-red-100 text-duo-cardinal border-red-200'
                                            }`}>{res.grade}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformance;
