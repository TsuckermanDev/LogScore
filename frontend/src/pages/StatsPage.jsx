import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Server as ServerIcon, FileText, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import DatePicker from '../components/common/DatePicker';
import { statsAPI, serversAPI } from '../services/api';
import { formatNumber, formatDate } from '../utils/formatters';

const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#6ee7b7', '#34d399'];

const StatsPage = () => {
  const [servers, setServers] = useState([]);
  const [selectedServers, setSelectedServers] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const response = await serversAPI.getAll();
      setServers(response.data.servers);
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };

  const loadStats = async () => {
    if (selectedServers.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await statsAPI.get(selectedServers, dateFrom, dateTo);
      setStats(response.data);
      
      // Format timeline data
      if (response.data.timeline) {
        const formatted = response.data.timeline.map(item => ({
          date: formatDate(item.date, 'short'),
          count: item.count
        }));
        setTimelineData(formatted);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServer = (serverId) => {
    setSelectedServers(prev => 
      prev.includes(serverId)
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const selectAllServers = () => {
    setSelectedServers(servers.map(s => s.server_id));
  };

  const deselectAllServers = () => {
    setSelectedServers([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Статистика
          </h1>
          <p className="text-secondary">
            Визуализация и анализ данных логов
          </p>
        </div>

        {/* Filters */}
        <div className="card-minecraft p-6 mb-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Серверы
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllServers}
                  className="text-xs text-minecraft-green-600 hover:text-minecraft-green-700 font-medium"
                >
                  Выбрать все
                </button>
                <span className="text-xs text-secondary">|</span>
                <button
                  onClick={deselectAllServers}
                  className="text-xs text-minecraft-green-600 hover:text-minecraft-green-700 font-medium"
                >
                  Снять все
                </button>
              </div>
            </div>
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
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="С даты"
              value={dateFrom}
              onChange={setDateFrom}
              icon={Calendar}
            />
            <DatePicker
              label="По дату"
              value={dateTo}
              onChange={setDateTo}
              icon={Calendar}
            />
          </div>

          <Button
            onClick={loadStats}
            variant="primary"
            icon={BarChart3}
            disabled={selectedServers.length === 0}
            loading={loading}
          >
            Загрузить статистику
          </Button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-minecraft p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-minecraft-green-100 rounded-lg">
                    <FileText className="text-minecraft-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-secondary mb-1">Всего логов</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatNumber(stats.total)}
                </p>
              </div>

              <div className="card-minecraft p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-minecraft-green-100 rounded-lg">
                    <ServerIcon className="text-minecraft-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-secondary mb-1">Серверов</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.distributionByServer.length}
                </p>
              </div>

              <div className="card-minecraft p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-minecraft-green-100 rounded-lg">
                    <BarChart3 className="text-minecraft-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-secondary mb-1">Типов логов</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.distributionByType.length}
                </p>
              </div>

              <div className="card-minecraft p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-minecraft-green-100 rounded-lg">
                    <TrendingUp className="text-minecraft-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-secondary mb-1">Период</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {timelineData.length}
                </p>
              </div>
            </div>

            {/* Timeline Chart */}
            {timelineData.length > 0 && (
              <div className="card-minecraft p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Временная шкала
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-primary)',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Количество логов"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By Type */}
              {stats.distributionByType.length > 0 && (
                <div className="card-minecraft p-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Распределение по типам
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.distributionByType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="log_type" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-primary)',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" name="Количество" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* By Server */}
              {stats.distributionByServer.length > 0 && (
                <div className="card-minecraft p-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Распределение по серверам
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.distributionByServer}
                        dataKey="count"
                        nameKey="server_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.distributionByServer.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-primary)',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card-minecraft p-12 text-center">
            <BarChart3 size={64} className="mx-auto mb-4 text-minecraft-green-500" />
            <p className="text-secondary text-lg mb-2">
              Данные не найдены для выбранных параметров
            </p>
            <p className="text-secondary text-sm">
              Выберите серверы и нажмите "Загрузить статистику"
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StatsPage;
