import { forwardRef } from 'react';

const Input = forwardRef(({
                              label,
                              error,
                              helperText,
                              leftIcon: LeftIcon,
                              rightIcon: RightIcon,
                              className = '',
                              containerClassName = '',
                              ...props
                          }, ref) => {
    return (
        <div className={containerClassName}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {LeftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <LeftIcon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            input-minecraft w-full
            ${LeftIcon ? 'pl-10' : ''}
            ${RightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
                    {...props}
                />
                {RightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <RightIcon size={20} />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
