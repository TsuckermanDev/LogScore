import { useState, useCallback } from 'react';
import { logsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchLogs = useCallback(async (filters) => {
        setLoading(true);

        try {
            const response = await logsAPI.search(filters);
            setLogs(response.data.logs);
            setTotal(response.data.total);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка загрузки логов';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const exportLogs = useCallback(async (filters) => {
        try {
            const response = await logsAPI.export(filters);

            if (filters.exportFormat === 'csv') {
                // Create download link for CSV
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'logs.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                // Create download link for JSON
                const dataStr = JSON.stringify(response.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = window.URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'logs.json');
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            toast.success('Логи экспортированы');
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка экспорта логов';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    return {
        logs,
        loading,
        total,
        page,
        totalPages,
        searchLogs,
        exportLogs
    };
};
