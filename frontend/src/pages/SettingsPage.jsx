import { useState } from 'react';
import { Key, Clock } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ApiKeyManager from '../components/settings/ApiKeyManager';
import ExpirationManager from '../components/settings/ExpirationManager';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('api-keys');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Настройки
          </h1>
          <p className="text-secondary">
            Управление API ключами и настройками хранения логов
          </p>
        </div>

        {/* Tabs */}
        <div className="card-minecraft mb-6">
          <div className="flex border-b-2" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'api-keys'
                  ? 'border-b-2 border-minecraft-green-500 text-minecraft-green-600'
                  : 'text-secondary hover:text-minecraft-green-500'
              }`}
            >
              <Key size={20} />
              API Ключи
            </button>
            <button
              onClick={() => setActiveTab('expiration')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'expiration'
                  ? 'border-b-2 border-minecraft-green-500 text-minecraft-green-600'
                  : 'text-secondary hover:text-minecraft-green-500'
              }`}
            >
              <Clock size={20} />
              Истечение логов
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'api-keys' && <ApiKeyManager />}
            {activeTab === 'expiration' && <ExpirationManager />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
