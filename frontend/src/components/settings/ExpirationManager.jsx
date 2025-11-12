import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { settingsAPI, serversAPI, typesAPI } from '../../services/api';
import { validateExpireDays } from '../../utils/validators';
import toast from 'react-hot-toast';

const ExpirationManager = () => {
  const [settings, setSettings] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [expireDays, setExpireDays] = useState('30');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedServer) {
      loadTypes();
    } else {
      setTypes([]);
      setSelectedType('');
    }
  }, [selectedServer]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [serversRes, settingsRes] = await Promise.all([
        serversAPI.getAll(),
        settingsAPI.getAll()
      ]);
      setServers(serversRes.data.servers);
      setSettings(settingsRes.data.settings);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const response = await typesAPI.getByServer(selectedServer);
      setTypes(response.data.types);
    } catch (error) {
      toast.error('Ошибка загрузки типов логов');
    }
  };

  const handleUpdate = async () => {
    if (!selectedServer || !selectedType) {
      setError('Выберите сервер и тип лога');
      return;
    }

    const validation = validateExpireDays(expireDays);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUpdating(true);
    setError('');

    try {
      await settingsAPI.update(selectedServer, selectedType, parseInt(expireDays));
      await loadData();
      toast.success('Настройки обновлены');
      setSelectedServer('');
      setSelectedType('');
      setExpireDays('30');
    } catch (error) {
      toast.error('Ошибка обновления настроек');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Update Form */}
      <div className="card-minecraft p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Изменить срок хранения
        </h4>

        <div className="space-y-4">
          <Select
            label="Сервер"
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            options={[
              { value: '', label: 'Выберите сервер' },
              ...servers.map(s => ({ value: s.server_id, label: s.server_name }))
            ]}
          />

          {selectedServer && (
            <Select
              label="Тип лога"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: '', label: 'Выберите тип' },
                ...types.map(t => ({ value: t.log_type, label: t.log_type }))
              ]}
            />
          )}

          <Input
            label="Срок хранения (дни)"
            type="number"
            value={expireDays}
            onChange={(e) => setExpireDays(e.target.value)}
            placeholder="30"
            min="1"
            max="365"
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            onClick={handleUpdate}
            variant="primary"
            icon={Save}
            loading={updating}
            disabled={!selectedServer || !selectedType}
          >
            Обновить настройки
          </Button>
        </div>
      </div>

      {/* Current Settings */}
      <div>
        <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Текущие настройки
        </h4>

        {settings.length > 0 ? (
          <div className="card-minecraft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Сервер
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Тип лога
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Срок хранения
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {settings.map((setting) => (
                    <tr key={`${setting.server_id}-${setting.log_type}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                        {setting.server_name}
                      </td>
                      <td className="px-4 py-4">
                        <code className="px-2 py-1 text-sm rounded" style={{ 
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)'
                        }}>
                          {setting.log_type}
                        </code>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-minecraft-green-600">
                        {setting.expires} дней
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-minecraft p-12 text-center">
            <p className="text-secondary text-lg">
              Настройки не найдены
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpirationManager;
