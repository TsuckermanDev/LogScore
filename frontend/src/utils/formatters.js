import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'dd.MM.yyyy HH:mm:ss') => {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr, { locale: ru });
    } catch (error) {
        return '-';
    }
};

export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('ru-RU').format(num);
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatLogData = (formatString, data, datetime) => {
    let formatted = formatString;

    // Replace data placeholders
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        formatted = formatted.replace(regex, value);
    });

    // Replace datetime placeholder
    if (datetime) {
        formatted = formatted.replace(
            /\{datetime\}/g,
            formatDate(datetime, 'dd.MM.yyyy HH:mm:ss')
        );
    }

    return formatted;
};

export const maskApiKey = (key) => {
    if (!key || key.length < 16) return key;
    return `${key.substring(0, 12)}...${key.substring(key.length - 8)}`;
};

export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
