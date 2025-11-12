export const validateLogin = (login) => {
    if (!login || login.trim().length === 0) {
        return 'Логин обязателен';
    }
    if (login.length < 3) {
        return 'Логин должен содержать минимум 3 символа';
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password || password.length === 0) {
        return 'Пароль обязателен';
    }
    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
    }
    return null;
};

export const validateDateRange = (dateFrom, dateTo) => {
    if (!dateFrom || !dateTo) return null;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (from > to) {
        return 'Дата начала не может быть позже даты окончания';
    }

    return null;
};

export const validateNumber = (value, min = null, max = null) => {
    const num = parseFloat(value);

    if (isNaN(num)) {
        return 'Введите корректное число';
    }

    if (min !== null && num < min) {
        return `Значение должно быть не меньше ${min}`;
    }

    if (max !== null && num > max) {
        return `Значение должно быть не больше ${max}`;
    }

    return null;
};

export const validateExpireDays = (days) => {
    const error = validateNumber(days, 1, 3650);
    if (error) return error;

    const num = parseInt(days);
    if (num !== parseFloat(days)) {
        return 'Введите целое число';
    }

    return null;
};
