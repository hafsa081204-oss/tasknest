const statusColor = {
  Pending: 'bg-orange-100 text-orange-700',
  Completed: 'bg-green-100 text-green-700',
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={`font-semibold text-gray-800 text-base leading-tight ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${statusColor[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{task.description}</p>
      )}

      <p className="text-xs text-gray-400 mb-4">
        🗓️ Created: {formatDate(task.createdAt)}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onToggleStatus(task)}
          className="flex-1 text-xs font-medium py-2 rounded-lg bg-indigo-50 text-primary hover:bg-indigo-100 transition-colors"
        >
          {task.status === 'Pending' ? '✅ Mark Complete' : '↩️ Mark Pending'}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;