import { useState, useEffect } from 'react';
import { Download, RefreshCw, Search, X } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FilterPanel from '../components/logs/FilterPanel';
import ViewToggle from '../components/logs/ViewToggle';
import LogsTable from '../components/logs/LogsTable';
import Pagination from '../components/common/Pagination';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import DatePicker from '../components/common/DatePicker';
import { logsAPI, serversAPI, typesAPI } from '../services/api';
import toast from 'react-hot-toast';

const LogsPage = () => {
  const [servers, setServers] = useState([]);
  const [selectedServers, setSelectedServers] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filters, setFilters] = useState({});
  const [view, setView] = useState('human');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dataFields, setDataFields] = useState([]);

  useEffect(() => {
    loadServers();
  }, []);

  useEffect(() => {
    if (selectedServers.length > 0) loadTypesForServers();
    else {
      setAllTypes([]);
      setSelectedTypes([]);
    }
  }, [selectedServers]);

  useEffect(() => {
    if (selectedServers.length === 1 && selectedTypes.length === 1) {
      typesAPI.getTypeData(selectedServers[0], selectedTypes[0])
        .then(res => setDataFields(res.data.fields || []))
        .catch(() => setDataFields([]));
    } else setDataFields([]);
  }, [selectedServers, selectedTypes]);

  const loadServers = async () => {
    try {
      const response = await serversAPI.getAll();
      setServers(response.data.servers);
    } catch {
      toast.error('Ошибка загрузки серверов');
    }
  };

  const loadTypesForServers = async () => {
    try {
      const typesPromises = selectedServers.map(serverId => typesAPI.getByServer(serverId));
      const typesResponses = await Promise.all(typesPromises);
      const allTypesMap = new Map();
      typesResponses.forEach(response => {
        response.data.types.forEach(type => {
          allTypesMap.set(type.log_type, type);
        });
      });
      setAllTypes(Array.from(allTypesMap.values()));
    } catch {
      toast.error('Ошибка загрузки типов логов');
    }
  };

  const loadLogs = async () => {
    if (selectedServers.length === 0) return;
    setLoading(true); setError(null);
    try {
      const response = await logsAPI.search({
        serverIds: selectedServers,
        logTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
        filters,
        page,
        limit,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });
      setLogs(response.data.logs);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки логов');
      toast.error('Ошибка загрузки логов');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); loadLogs();
  };

  const toggleServer = (serverId) => {
    setSelectedServers(prev =>
      prev.includes(serverId)
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const toggleType = (logType) => {
    setSelectedTypes(prev =>
      prev.includes(logType)
        ? prev.filter(t => t !== logType)
        : [...prev, logType]
    );
  };

  const handleExport = async () => {
    try {
      const response = await logsAPI.export({
        serverIds: selectedServers,
        logTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
        filters,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Логи экспортированы');
    } catch {
      toast.error('Ошибка экспорта логов');
    }
  };

  // СОЗДАЕМ мапу типов для передачи в LogsTable
const logTypesMap = {};
allTypes.forEach(type => {
  logTypesMap[type.log_type] = type;
});

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="card-minecraft p-6 mb-6 space-y-4">
          {/* Server Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Серверы
            </label>
            <div className="flex flex-wrap gap-2">
              {servers.map(server => (
                <button
                  key={server.server_id}
                  onClick={() => toggleServer(server.server_id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedServers.includes(server.server_id)
                      ? 'bg-minecraft-green-500 text-white shadow-minecraft'
                      : 'border-2 hover:border-minecraft-green-500'
                  }`}
                  style={!selectedServers.includes(server.server_id) ? {
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  } : {}}
                >
                  {server.server_name}
                  {selectedServers.includes(server.server_id) && (
                    <X size={16} className="inline ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Type Selection */}
          {allTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Типы логов (необязательно)
              </label>
              <div className="flex flex-wrap gap-2">
                {allTypes.map(type => (
                  <button
                    key={type.log_type}
                    onClick={() => toggleType(type.log_type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTypes.includes(type.log_type)
                        ? 'bg-minecraft-green-500 text-white shadow-minecraft'
                        : 'border-2 hover:border-minecraft-green-500'
                    }`}
                    style={!selectedTypes.includes(type.log_type) ? {
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    } : {}}
                  >
                    {type.log_type}
                    {selectedTypes.includes(type.log_type) && (
                      <X size={16} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="С даты"
              value={dateFrom}
              onChange={setDateFrom}
            />
            <DatePicker
              label="По дату"
              value={dateTo}
              onChange={setDateTo}
            />
          </div>

          {/* Additional Filters */}
          {selectedServers.length === 1 && selectedTypes.length === 1 && (
            <FilterPanel
              serverId={selectedServers[0]}
              logType={selectedTypes[0]}
              filters={filters}
              onChange={setFilters}
              dataFields={dataFields}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSearch}
              variant="primary"
              disabled={selectedServers.length === 0}
              icon={Search}
              className="flex-1 min-w-[120px]"
            >
              Поиск
            </Button>
            <Button
              onClick={() => {
                setPage(1);
                loadLogs();
              }}
              variant="outline"
              disabled={selectedServers.length === 0}
              icon={RefreshCw}
              className="flex-1 min-w-[120px]"
            >
              Обновить
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              disabled={!logs.length}
              icon={Download}
              className="flex-1 min-w-[120px]"
            >
              Экспорт
            </Button>
          </div>
        </div>

        {/* Результаты */}
        {selectedServers.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary">
                  Найдено: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{total}</span> логов
                </span>
                <Select
                  value={limit.toString()}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value)); setPage(1);
                  }}
                  options={[
                    { value: '25', label: '25 на странице' },
                    { value: '50', label: '50 на странице' },
                    { value: '100', label: '100 на странице' }
                  ]}
                />
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader /></div>
            ) : error ? (
              <div className="card-minecraft p-12 text-center">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : logs.length > 0 ? (
              <>
                <LogsTable
                  logs={logs}
                  viewMode={view}
                  dataFields={dataFields}
                  logTypesMap={logTypesMap}
                />
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => { setPage(newPage); loadLogs(); }}
                  />
                </div>
              </>
            ) : (
              <div className="card-minecraft p-12 text-center">
                <p className="text-secondary text-lg">
                  Логи не найдены. Попробуйте изменить параметры поиска.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="card-minecraft p-12 text-center">
            <p className="text-secondary text-lg">Выберите хотя бы один сервер для начала поиска логов</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LogsPage;
