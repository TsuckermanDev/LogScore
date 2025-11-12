import { useState, useEffect } from 'react';
import { Server, Database, FileCode, RefreshCw } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { serversAPI } from '../services/api';

const ArchitecturePage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await serversAPI.getAll();
      setServers(response.data.servers);
    } catch (error) {
      console.error('Error loading architecture:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Архитектура логов
            </h1>
            <p className="text-secondary">
              Структура серверов, типов логов и полей данных
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            icon={RefreshCw}
          >
            Обновить
          </Button>
        </div>

        {/* Servers */}
        {servers.length > 0 ? (
          <div className="space-y-6">
            {servers.map((server) => (
              <div key={server.server_id} className="card-minecraft p-6">
                {/* Server Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="p-3 bg-minecraft-green-100 rounded-lg">
                    <Server className="text-minecraft-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {server.server_name}
                    </h2>
                    <p className="text-sm text-secondary">
                      ID: <code className="px-2 py-1 rounded text-xs" style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)'
                      }}>{server.server_id}</code> • {server.types?.length || 0} типов логов
                    </p>
                  </div>
                </div>

                {/* Log Types */}
                {server.types && server.types.length > 0 ? (
                  <div className="space-y-4">
                    {server.types.map((type) => (
                      <div 
                        key={type.log_type} 
                        className="p-4 rounded-lg border-2"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {/* Type Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-minecraft-green-100 rounded">
                            <FileCode className="text-minecraft-green-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                              {type.log_type}
                            </h3>
                            <code className="text-xs px-2 py-1 rounded" style={{ 
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)'
                            }}>
                              {type.format}
                            </code>
                            <p className="text-xs text-secondary mt-1">
                              Хранение: <span className="font-medium text-minecraft-green-600">{type.expires} дней</span> • {type.dataFields?.length || 0} полей
                            </p>
                          </div>
                        </div>

                        {/* Data Fields */}
                        {type.dataFields && type.dataFields.length > 0 ? (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Database size={16} className="text-minecraft-green-600" />
                              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Поля данных
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {type.dataFields.map((field) => (
                                <div 
                                  key={field.type_data}
                                  className="p-2 rounded border"
                                  style={{ 
                                    backgroundColor: 'var(--bg-primary)',
                                    borderColor: 'var(--border-color)'
                                  }}
                                >
                                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {field.type_data}
                                  </code>
                                  <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ 
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)'
                                  }}>
                                    {field.data_type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-secondary italic mt-2">
                            Нет полей данных
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary text-center py-8">
                    Нет зарегистрированных типов логов для этого сервера
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card-minecraft p-12 text-center">
            <Server size={64} className="mx-auto mb-4 text-minecraft-green-500" />
            <p className="text-secondary text-lg mb-2">
              Нет зарегистрированных серверов
            </p>
            <p className="text-secondary text-sm">
              Серверы регистрируются автоматически при подключении плагинов
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArchitecturePage;
