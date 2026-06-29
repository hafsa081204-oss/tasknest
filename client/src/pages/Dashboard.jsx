import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/tasks/stats'),
          api.get('/tasks'),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-primary font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-primary">{user?.name}!</span> 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here's your task overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Tasks" value={stats.total} color="indigo" icon="📋" />
        <StatCard title="Pending" value={stats.pending} color="yellow" icon="⏳" />
        <StatCard title="Completed" value={stats.completed} color="green" icon="✅" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700">Overall Completion</h2>
          <span className="text-primary font-bold text-lg">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary font-medium hover:underline">
            View All →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">No tasks yet!</p>
            <Link
              to="/tasks"
              className="inline-block bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors"
            >
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  task.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;