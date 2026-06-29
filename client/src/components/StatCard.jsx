const StatCard = ({ title, value, color, icon }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <div className={`rounded-2xl border p-6 flex items-center gap-4 ${colorMap[color]}`}>
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-75">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;