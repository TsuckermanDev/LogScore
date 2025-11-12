import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Проверка поддержки Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          throw err;
        }
        
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Не удалось скопировать в буфер обмена');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg transition-all duration-200 ${
        copied 
          ? 'bg-minecraft-green-500 text-white scale-110' 
          : 'hover:bg-minecraft-green-100 border-2'
      } ${className}`}
      style={!copied ? { 
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)'
      } : {}}
      title={copied ? 'Скопировано!' : 'Копировать'}
    >
      {copied ? <Check size={20} /> : <Copy size={20} />}
    </button>
  );
};

export default CopyButton;
