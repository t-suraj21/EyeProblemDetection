import { Filter } from 'lucide-react';

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Doctors', count: null },
    { id: 'private', label: 'Private', count: null },
    { id: 'government', label: 'Government', count: null }
  ];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
      </div>
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            {filter.count !== null && (
              <span className="ml-1 text-xs opacity-75">({filter.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs; 