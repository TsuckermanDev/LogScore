import { Github, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient-minecraft">
              LogScore
            </h3>
            <p className="text-secondary text-sm">
              Современная система логирования для Minecraft серверов. 
              Мощный поиск, детальная статистика и удобный веб-интерфейс.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Навигация
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-secondary hover:text-minecraft-green-400 transition-colors">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-secondary hover:text-minecraft-green-400 transition-colors">
                  Как это работает
                </a>
              </li>
              <li>
                <a href="/login" className="text-secondary hover:text-minecraft-green-400 transition-colors">
                  Панель управления
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Информация
            </h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li>Версия: 1.0.0</li>
              <li>Node.js 20.19+</li>
              <li>React 19</li>
              <li>Fastify 5</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-secondary" style={{ borderColor: 'var(--border-color)' }}>
          <p>
            © {currentYear} LogScore. Разработано с <Heart size={16} className="inline text-red-500" />
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-minecraft-green-400 transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
