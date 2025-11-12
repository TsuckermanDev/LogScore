import { Filter, X } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import { FILTER_OPERATORS } from '../../utils/constants';

const FilterPanel = ({ filters, onChange, dataFields = [] }) => {
    const handleAddFilter = (field) => {
        const operators = FILTER_OPERATORS[field.data_type.toUpperCase()] || FILTER_OPERATORS.STRING;
        onChange({
            ...filters,
            [field.type_data]: {
                operator: operators[0].value,
                value: '',
                value2: '',
                dataType: field.data_type
            }
        });
    };

    const handleRemoveFilter = (fieldName) => {
        const newFilters = { ...filters };
        delete newFilters[fieldName];
        onChange(newFilters);
    };

    const handleFilterChange = (fieldName, key, value) => {
        onChange({
            ...filters,
            [fieldName]: {
                ...filters[fieldName],
                [key]: value
            }
        });
    };

    const getOperatorsForField = (dataType) => {
        return FILTER_OPERATORS[dataType.toUpperCase()] || FILTER_OPERATORS.STRING;
    };

    if (!dataFields || dataFields.length === 0) {
        return null;
    }

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Filter size={20} className="text-minecraft-green-500" />
                Фильтры по данным
            </label>

            {/* Available fields to add */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Добавить фильтр:</p>
                <div className="flex flex-wrap gap-2">
                    {dataFields
                        .filter(field => !filters[field.type_data])
                        .map((field) => (
                            <button
                                key={field.type_data}
                                onClick={() => handleAddFilter(field)}
                                className="px-3 py-1.5 text-sm bg-gray-900 border-2 border-minecraft-green-700 text-gray-200 rounded-lg hover:bg-minecraft-green-900 hover:text-white transition-colors"
                            >
                                + {field.type_data} ({field.data_type})
                            </button>
                        ))}
                </div>
            </div>

            {/* Active filters */}
            {Object.keys(filters).length > 0 && (
                <div className="space-y-3">
                    {Object.entries(filters).map(([fieldName, filter]) => {
                        const field = dataFields.find(f => f.type_data === fieldName);
                        if (!field) return null;

                        const operators = getOperatorsForField(field.data_type);
                        const needsSecondValue = filter.operator === 'between';

                        return (
                            <div key={fieldName} className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-200 mb-1">{fieldName}</p>
                                            <p className="text-xs text-gray-400">{field.data_type}</p>
                                        </div>

                                        <Select
                                            value={filter.operator}
                                            onChange={(e) => handleFilterChange(fieldName, 'operator', e.target.value)}
                                            options={operators}
                                        />

                                        <div className="flex gap-2">
                                            <Input
                                                type={field.data_type === 'number' ? 'number' : 'text'}
                                                value={filter.value}
                                                onChange={(e) => handleFilterChange(fieldName, 'value', e.target.value)}
                                                placeholder="Значение"
                                            />
                                            {needsSecondValue && (
                                                <Input
                                                    type={field.data_type === 'number' ? 'number' : 'text'}
                                                    value={filter.value2}
                                                    onChange={(e) => handleFilterChange(fieldName, 'value2', e.target.value)}
                                                    placeholder="До"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFilter(fieldName)}
                                        className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {Object.keys(filters).length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                    Нет активных фильтров
                </p>
            )}
        </div>
    );
};

export default FilterPanel;
