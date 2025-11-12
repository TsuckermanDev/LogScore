import { Loader2 } from 'lucide-react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    loading = false,
                    disabled = false,
                    className = '',
                    icon: Icon,
                    ...props
                }) => {
    const baseClasses = 'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2';

    const variants = {
        primary: 'btn-minecraft',
        secondary: 'btn-minecraft-outline',
        danger: 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-700 shadow-minecraft hover:shadow-minecraft-hover',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
        <button
            className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            ) : Icon ? (
                <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
