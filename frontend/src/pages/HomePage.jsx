import { Link } from 'react-router-dom';
import { 
  Zap, 
  Search, 
  Shield, 
  BarChart3, 
  Server, 
  Database, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 minecraft-square" />
        <div className="absolute bottom-20 right-20 minecraft-square" />
        <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-minecraft-green-300)' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-minecraft">LogScore</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>Система логирования</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>для Minecraft серверов</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Централизованное хранение, мощный поиск и детальная статистика 
              всех событий на ваших серверах
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-minecraft text-lg inline-flex items-center gap-2">
                Войти в панель
                <ArrowRight size={20} />
              </Link>
              <a 
                href="#how-it-works" 
                className="btn-minecraft-outline text-lg inline-flex items-center gap-2"
              >
                Как это работает
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Почему <span className="text-gradient-minecraft">LogScore</span>?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Профессиональная система логирования с удобным интерфейсом 
              и широкими возможностями
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card-minecraft p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 gradient-minecraft rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Высокая производительность
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Оптимизированные запросы к БД и индексы обеспечивают 
                быстрый поиск среди миллионов логов
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-minecraft p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 gradient-minecraft rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Гибкая фильтрация
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Поиск по любым параметрам: серверам, типам логов, 
                пользователям, датам и кастомным полям
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-minecraft p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 gradient-minecraft rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Безопасность
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Защита через API ключи и JWT токены. 
                Все пароли хешируются с bcrypt
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-minecraft p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 gradient-minecraft rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Детальная статистика
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Визуализация данных логов с графиками, 
                распределением и временными шкалами
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Как это работает
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Простая интеграция за несколько шагов
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 gradient-minecraft rounded-full flex items-center justify-center mx-auto mb-6 shadow-minecraft">
                  <Server className="text-white" size={36} />
                </div>
                <div className="card-minecraft p-6">
                  <div className="text-4xl font-bold text-minecraft-green-500 mb-2">1</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Установите плагин
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Добавьте плагин LogScore на свой Minecraft сервер. 
                    При первом запуске он автоматически зарегистрирует сервер
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 gradient-minecraft rounded-full flex items-center justify-center mx-auto mb-6 shadow-minecraft">
                  <Database className="text-white" size={36} />
                </div>
                <div className="card-minecraft p-6">
                  <div className="text-4xl font-bold text-minecraft-green-500 mb-2">2</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Логи отправляются
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Плагины отправляют события через REST API. 
                    Данные сохраняются в MySQL с автоматическим истечением
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 gradient-minecraft rounded-full flex items-center justify-center mx-auto mb-6 shadow-minecraft">
                  <BarChart3 className="text-white" size={36} />
                </div>
                <div className="card-minecraft p-6">
                  <div className="text-4xl font-bold text-minecraft-green-500 mb-2">3</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Анализируйте данные
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Используйте веб-панель для поиска, фильтрации 
                    и визуализации данных логов
                  </p>
                </div>
              </div>
            </div>
          </div>

{/* Architecture diagram */}
<div className="mt-16 max-w-4xl mx-auto">
  <div className="card-minecraft p-8">
    <h3 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
      Архитектура системы
    </h3>
    <div className="flex flex-wrap items-center justify-center gap-4 text-center">
      <div className="px-6 py-4 rounded-lg border-2 gradient-minecraft border-minecraft-green-700 shadow-minecraft">
        <div className="font-bold text-white">Minecraft Плагин</div>
      </div>
      <ArrowRight className="text-minecraft-green-500" size={32} />
      <div className="px-6 py-4 rounded-lg border-2 gradient-minecraft border-minecraft-green-700 shadow-minecraft">
        <div className="font-bold text-white">REST API</div>
      </div>
      <ArrowRight className="text-minecraft-green-500" size={32} />
      <div className="px-6 py-4 rounded-lg border-2 gradient-minecraft border-minecraft-green-700 shadow-minecraft">
        <div className="font-bold text-white">MySQL</div>
      </div>
      <ArrowRight className="text-minecraft-green-500" size={32} />
      <div className="px-6 py-4 rounded-lg border-2 gradient-minecraft border-minecraft-green-700 shadow-minecraft">
        <div className="font-bold text-white">Web Panel</div>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

{/* CTA Section */}
<section className="py-20 gradient-minecraft text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold mb-6">
      Готовы начать?
    </h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
      Получите полный контроль над логами ваших Minecraft серверов
    </p>
    <Link 
      to="/login" 
      className="inline-flex items-center gap-2 bg-white text-minecraft-green-700 font-bold px-8 py-4 rounded-lg hover:shadow-minecraft-hover hover:scale-105 transition-all duration-200 shadow-minecraft"
    >
      Войти в панель
      <ArrowRight size={24} />
    </Link>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default HomePage;
