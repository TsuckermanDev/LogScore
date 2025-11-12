import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import Button from '../common/Button';
import CopyButton from '../common/CopyButton';
import DatePicker from '../common/DatePicker';
import Loader from '../common/Loader';
import { apiKeysAPI } from '../../services/api';
import { formatDate, maskApiKey } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ApiKeyManager = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const response = await apiKeysAPI.getAll();
      setKeys(response.data.keys);
    } catch (error) {
      toast.error('Ошибка загрузки API ключей');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await apiKeysAPI.create(expiresAt || null);
      setNewApiKey(response.data.api_key);
      setExpiresAt('');
      setShowCreateForm(false);
      await loadKeys();
      toast.success('API ключ создан');
    } catch (error) {
      toast.error('Ошибка создания API ключа');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (apiKey) => {
    if (!confirm('Вы уверены, что хотите удалить этот API ключ?')) {
      return;
    }

    try {
      await apiKeysAPI.delete(apiKey);
      await loadKeys();
      toast.success('API ключ удален');
    } catch (error) {
      toast.error('Ошибка удаления API ключа');
    }
  };

  const toggleKeyVisibility = (apiKey) => {
    setVisibleKeys(prev => ({
      ...prev,
      [apiKey]: !prev[apiKey]
    }));
  };

  const closeNewKeyModal = () => {
    setNewApiKey(null);
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
      {/* Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            API Ключи
          </h3>
          <p className="text-sm text-secondary">
            Управление ключами для доступа к API
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
          icon={Plus}
        >
          Создать ключ
        </Button>
      </div>

{/* Create Form */}
{showCreateForm && (
  <div className="card-minecraft p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
    <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
      Новый API ключ
    </h4>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Дата истечения (необязательно)
        </label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="input-minecraft w-full cursor-pointer"
          style={{ 
            colorScheme: 'dark'
          }}
        />
        <p className="text-xs text-secondary mt-1">
          Оставьте пустым для создания вечного ключа
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCreate}
          variant="primary"
          loading={creating}
        >
          Создать ключ
        </Button>
        <Button
          onClick={() => setShowCreateForm(false)}
          variant="outline"
        >
          Отмена
        </Button>
      </div>
    </div>
  </div>
)}

      {/* Keys Table */}
      {keys.length > 0 ? (
        <div className="card-minecraft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    API Ключ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Использований
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Последнее использование
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Создан
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Истекает
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Действия
                  </th>
                </tr>
              </thead>
<tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
  {keys.map((key) => (
    <tr key={key.api_key} style={{ backgroundColor: 'var(--bg-primary)' }}>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <code className="px-2 py-1 rounded text-sm font-mono" style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)'
          }}>
  {(() => {
    const displayed = visibleKeys[key.api_key] ? key.api_key : maskApiKey(key.api_key);
    console.log('API Key:', key.api_key, 'Visible:', visibleKeys[key.api_key], 'Displayed:', displayed);
    return displayed;
  })()}
          </code>
          <button
            onClick={() => toggleKeyVisibility(key.api_key)}
            className="p-1 rounded hover:bg-minecraft-green-100 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title={visibleKeys[key.api_key] ? 'Скрыть' : 'Показать'}
          >
            {visibleKeys[key.api_key] ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {visibleKeys[key.api_key] && (
            <CopyButton text={key.api_key} />
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
        {key.uses}
      </td>
      <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {key.last_use ? formatDate(key.last_use) : 'Никогда'}
      </td>
      <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {formatDate(key.created_at)}
      </td>
      <td className="px-4 py-4 text-sm">
        {key.expires_at ? (
          <span style={{ color: 'var(--text-secondary)' }}>
            {formatDate(key.expires_at)}
          </span>
        ) : (
          <span className="text-minecraft-green-600 font-medium">
            Вечный
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-right">
        <Button
          onClick={() => handleDelete(key.api_key)}
          variant="outline"
          size="sm"
          icon={Trash2}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Удалить
        </Button>
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
            У вас пока нет API ключей
          </p>
          <p className="text-secondary text-sm mt-2">
            Создайте первый ключ для начала работы с API
          </p>
        </div>
      )}

      {/* New API Key Modal */}
      {newApiKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-minecraft p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              API ключ создан!
            </h3>
            
            <div className="p-4 rounded-lg mb-4" style={{ 
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              border: '2px solid #fbbf24'
            }}>
              <p className="text-sm font-medium flex items-center gap-2 mb-2" style={{ color: '#f59e0b' }}>
                ⚠️ Важно!
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Скопируйте и сохраните этот ключ. Он больше не будет показан в полном виде.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <code className="flex-1 px-4 py-3 rounded text-sm font-mono" style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)'
              }}>
                {newApiKey}
              </code>
              <CopyButton text={newApiKey} />
            </div>

            <Button onClick={closeNewKeyModal} variant="primary" className="w-full">
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
