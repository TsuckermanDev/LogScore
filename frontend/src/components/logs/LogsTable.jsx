import { formatDate } from '../../utils/formatters';

const LogsTable = ({ logs, viewMode, logTypesMap = {} }) => {
  if (viewMode === 'human' && logs.length > 0) {
    return <LogsTableHuman logs={logs} logTypesMap={logTypesMap} />;
  }
  return <LogsTableRaw logs={logs} />;
};

function formatString(template, log) {
  if (!template) return '';
  return template.replace(/{(w+)}/g, (_, key) => {
    if (log.data && Object.prototype.hasOwnProperty.call(log.data, key) && log.data[key] != null) {
      return log.data[key];
    }
    if (key === 'datetime') return log.datetime ? formatDate(log.datetime) : '';
    if (key === 'serverId') return log.serverId ?? '';
    return '';
  });
}

const LogsTableHuman = ({ logs, logTypesMap }) => (
  <div className="card-minecraft overflow-hidden bg-gray-900">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-minecraft-green-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Сервер</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Тип</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Событие</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Время</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {logs.map((log) => {
            const type = logTypesMap[log.logType] || {};
            const template = type.human_format || type.format;
            const human = formatString(template, log);
            return (
              <tr key={log.id} className="hover:bg-minecraft-green-900 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-gray-400">#{log.id}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-minecraft-green-700 text-white rounded font-medium">{log.serverId}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-minecraft-green-900 text-minecraft-green-300 rounded font-medium">{log.logType}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-200">{human}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{log.datetime ? formatDate(log.datetime) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const LogsTableRaw = ({ logs }) => (
  <div className="card-minecraft overflow-hidden bg-gray-900">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-minecraft-green-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Сервер</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Тип</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Данные</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Время</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-minecraft-green-900 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-gray-400">#{log.id}</td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-minecraft-green-700 text-white rounded font-medium">{log.serverId}</span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-minecraft-green-900 text-minecraft-green-300 rounded font-medium">{log.logType}</span>
              </td>
              <td className="px-4 py-3 text-sm">
                <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto font-mono">{JSON.stringify(log.data, null, 2)}</pre>
              </td>
              <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{log.datetime ? formatDate(log.datetime) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LogsTable;