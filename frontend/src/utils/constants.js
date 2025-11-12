export const DATA_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATETIME: 'datetime'
};

export const FILTER_OPERATORS = {
    STRING: [
        { value: 'equals', label: 'Равно' },
        { value: 'contains', label: 'Содержит' },
        { value: 'starts_with', label: 'Начинается с' },
        { value: 'ends_with', label: 'Заканчивается на' }
    ],
    NUMBER: [
        { value: 'equals', label: '=' },
        { value: 'greater', label: '>' },
        { value: 'less', label: '<' },
        { value: 'greater_equal', label: '>=' },
        { value: 'less_equal', label: '<=' },
        { value: 'between', label: 'Между' }
    ],
    BOOLEAN: [
        { value: 'equals', label: 'Равно' }
    ],
    DATETIME: [
        { value: 'equals', label: 'Равно' },
        { value: 'greater', label: 'После' },
        { value: 'less', label: 'До' },
        { value: 'between', label: 'Между' }
    ]
};

export const STATS_GROUP_BY = [
    { value: 'hour', label: 'По часам' },
    { value: 'day', label: 'По дням' },
    { value: 'week', label: 'По неделям' },
    { value: 'month', label: 'По месяцам' }
];

export const LOGS_PER_PAGE_OPTIONS = [10, 25, 50, 100, 250];

export const VIEW_MODES = {
    HUMAN: 'human',
    RAW: 'raw'
};

export const EXPORT_FORMATS = {
    JSON: 'json',
    CSV: 'csv'
};
