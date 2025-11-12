import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        className = ''
                    }) => {
    const maxVisiblePages = 5;

    const getPageNumbers = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border-2 border-minecraft-green-300 hover:bg-minecraft-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <ChevronLeft size={20} />
            </button>

            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-1 rounded-lg border-2 border-minecraft-green-300 hover:bg-minecraft-green-50 transition-all duration-200"
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="text-gray-400">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-lg border-2 transition-all duration-200 ${
                        page === currentPage
                            ? 'bg-minecraft-green-500 text-white border-minecraft-green-700 shadow-minecraft'
                            : 'border-minecraft-green-300 hover:bg-minecraft-green-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="text-gray-400">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-1 rounded-lg border-2 border-minecraft-green-300 hover:bg-minecraft-green-50 transition-all duration-200"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border-2 border-minecraft-green-300 hover:bg-minecraft-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
