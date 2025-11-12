import { FileText } from 'lucide-react';
import Checkbox from '../common/Checkbox';

const TypeSelector = ({ types, selectedTypes, onChange }) => {
  const handleToggle = (logType) => {
    if (selectedTypes.includes(logType)) {
      onChange(selectedTypes.filter(t => t !== logType));
    } else {
      onChange([...selectedTypes, logType]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === types.length) {
      onChange([]);
    } else {
      onChange(types.map(t => t.log_type));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileText size={20} className="text-minecraft-green-500" />
          Типы логов
        </label>
        {types.length > 1 && (
          <button
            onClick={handleSelectAll}
            className="text-sm text-minecraft-green-600 hover:text-minecraft-green-700 font-medium"
          >
            {selectedTypes.length === types.length ? 'Снять все' : 'Выбрать все'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {types.map((type) => (
          <div
            key={`${type.server_id}-${type.log_type}`}
            onClick={() => handleToggle(type.log_type)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedTypes.includes(type.log_type)
                ? 'border-minecraft-green-500 bg-minecraft-green-50'
                : 'border-gray-300 bg-white hover:border-minecraft-green-300'
              }
            `}
          >
            <Checkbox
              checked={selectedTypes.includes(type.log_type)}
              onChange={() => handleToggle(type.log_type)}
              label={type.displayName}
            />
          </div>
        ))}
      </div>

      {types.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Нет доступных типов логов для выбранных серверов
        </p>
      )}
    </div>
  );
};

export default TypeSelector;
