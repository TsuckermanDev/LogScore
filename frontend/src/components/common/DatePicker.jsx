import { Calendar } from 'lucide-react';

const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon = Calendar,
  placeholder = 'Выберите дату',
  className = '' 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-minecraft pl-3 pr-3 cursor-pointer w-full"
          style={{ 
            colorScheme: 'dark'
          }}
        />
      </div>
    </div>
  );
};

export default DatePicker;
