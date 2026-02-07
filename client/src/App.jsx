import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherStudents from './pages/TeacherStudents';
import StudentDashboard from './pages/StudentDashboard';
import StudentPerformance from './pages/StudentPerformance';
import TakeQuiz from './pages/TakeQuiz';
import Forum from './pages/Forum';
import TeacherStudentDetails from './pages/TeacherStudentDetails';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']}><Layout /></ProtectedRoute>}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/students" element={<TeacherStudents />} />
                <Route path="/teacher/forum" element={<Forum />} />
                <Route path="/teacher/student/:id" element={<TeacherStudentDetails />} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']}><Layout /></ProtectedRoute>}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/quiz/:id" element={<TakeQuiz />} />
                <Route path="/student/performance" element={<StudentPerformance />} />
                <Route path="/student/forum" element={<Forum />} />
            </Route>
        </Routes>
    );
}

export default App;
