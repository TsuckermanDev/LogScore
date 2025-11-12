import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!login || !password) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const result = await authLogin(login, password);
      
      if (result.success) {
        toast.success('Добро пожаловать!');
        navigate('/logs');
      } else {
        toast.error(result.error || 'Ошибка авторизации');
      }
    } catch (error) {
      toast.error('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 minecraft-square" />
      <div className="absolute bottom-20 right-20 minecraft-square" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-20 h-20 gradient-minecraft rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-minecraft-hover">
              <span className="text-white font-bold text-3xl">LS</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gradient-minecraft mb-2">
            LogScore
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Войдите в панель управления
          </p>
        </div>

        {/* Login Form */}
        <div className="card-minecraft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Логин
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  autoComplete="username"
                  autoFocus
                  className="input-minecraft pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  className="input-minecraft pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={LogIn}
              className="w-full"
            >
              Войти
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg border-2" style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--color-minecraft-green-300)' 
          }}>
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
              По умолчанию: <span className="font-bold">admin</span> / <span className="font-bold">admin123</span>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-minecraft-green-600 hover:text-minecraft-green-700 font-medium transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
