import { forwardRef } from 'react';
import { Check } from 'lucide-react';

const Checkbox = forwardRef(({
                                 label,
                                 error,
                                 className = '',
                                 ...props
                             }, ref) => {
    return (
        <div>
            <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="sr-only peer"
                        {...props}
                    />
                    <div className={`
            w-6 h-6 border-2 rounded transition-all duration-200
            peer-checked:bg-minecraft-green-500 peer-checked:border-minecraft-green-700
            peer-focus:ring-2 peer-focus:ring-minecraft-green-200
            group-hover:border-minecraft-green-400
            ${error ? 'border-red-500' : 'border-minecraft-green-300'}
            ${className}
          `}>
                        <Check
                            size={16}
                            className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
                {label && (
                    <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
                )}
            </label>
            {error && (
                <p className="mt-1 ml-9 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
