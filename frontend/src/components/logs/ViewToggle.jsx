import { Eye, Code } from 'lucide-react';

const ViewToggle = ({ view, onChange }) => {
  const isHuman = view === 'human';
  const isRaw = view === 'raw';
  const base =
    'flex-1 px-3 py-2 text-center font-semibold rounded-md transition-all duration-150';
  const active = 'bg-teal-600 text-white';
  const inactive = 'bg-transparent text-teal-100 hover:bg-teal-100/20';
  return (
    <div className="flex rounded-md border-2 border-teal-700 overflow-hidden" role="group" aria-label="View mode">
      <button
        onClick={() => onChange('human')}
        className={`${base} ${isHuman ? active : inactive}`}
        aria-pressed={isHuman}
      >
        <Eye size={16} />
        <span className="ml-2 hidden sm:inline">Человеко читаемый</span>
      </button>
      <button
        onClick={() => onChange('raw')}
        className={`${base} ${isRaw ? active : inactive}`}
        aria-pressed={isRaw}
      >
        <Code size={16} />
        <span className="ml-2 hidden sm:inline">Сырой</span>
      </button>
    </div>
  );
};

export default ViewToggle;
