import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user ? [
    { path: '/logs', label: 'Логи' },
    { path: '/stats', label: 'Статистика' },
    { path: '/architecture', label: 'Архитектура' },
    { path: '/settings', label: 'Настройки' }
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="card-minecraft sticky top-0 z-50 border-b-4 border-minecraft-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 gradient-minecraft rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-minecraft">
              <span className="text-white font-bold text-xl">LS</span>
            </div>
            <span className="text-2xl font-bold text-gradient-minecraft hidden sm:inline">
              LogScore
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-minecraft-green-500 text-white shadow-minecraft'
                      : 'hover:bg-minecraft-green-100'
                  }`}
                  style={!isActive(item.path) ? { color: 'var(--text-primary)' } : {}}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 bg-minecraft-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.login.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user.login}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Выйти"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-minecraft text-sm">
                Войти
              </Link>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg theme-toggle"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-minecraft-green-500 text-white'
                    : 'hover:bg-minecraft-green-100'
                }`}
                style={!isActive(item.path) ? { color: 'var(--text-primary)' } : {}}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
