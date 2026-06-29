import { useState, useEffect } from 'react';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTasks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterStatus]);

  const handleAddOrEdit = async (form) => {
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        status: task.status === 'Pending' ? 'Completed' : 'Pending',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primaryDark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-200"
        >
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); }}
            className="text-sm text-red-500 font-medium hover:underline px-2"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-primary font-semibold">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 font-medium">No tasks found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting filters or add a new task</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddOrEdit}
        editTask={editTask}
      />
    </div>
  );
};

export default Tasks;