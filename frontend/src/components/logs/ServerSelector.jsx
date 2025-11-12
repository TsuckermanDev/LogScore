import { Server } from 'lucide-react';
import Checkbox from '../common/Checkbox';

const ServerSelector = ({ servers, selectedServers, onChange }) => {
  const handleToggle = (serverId) => {
    if (selectedServers.includes(serverId)) {
      onChange(selectedServers.filter(id => id !== serverId));
    } else {
      onChange([...selectedServers, serverId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedServers.length === servers.length) {
      onChange([]);
    } else {
      onChange(servers.map(s => s.server_id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Server size={20} className="text-minecraft-green-500" />
          Серверы
        </label>
        {servers.length > 1 && (
          <button
            onClick={handleSelectAll}
            className="text-sm text-minecraft-green-600 hover:text-minecraft-green-700 font-medium"
          >
            {selectedServers.length === servers.length ? 'Снять все' : 'Выбрать все'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {servers.map((server) => (
          <div
            key={server.server_id}
            onClick={() => handleToggle(server.server_id)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedServers.includes(server.server_id)
                ? 'border-minecraft-green-500 bg-minecraft-green-50'
                : 'border-gray-300 bg-white hover:border-minecraft-green-300'
              }
            `}
          >
            <Checkbox
              checked={selectedServers.includes(server.server_id)}
              onChange={() => handleToggle(server.server_id)}
              label={server.server_name}
            />
          </div>
        ))}
      </div>

      {servers.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Нет доступных серверов
        </p>
      )}
    </div>
  );
};

export default ServerSelector;
