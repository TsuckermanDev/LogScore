const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`${sizes[size]} border-4 border-minecraft-green-200 border-t-minecraft-green-500 rounded-full animate-spin`} />
            {text && (
                <p className="text-gray-600 text-sm font-medium">{text}</p>
            )}
        </div>
    );
};

export default Loader;
