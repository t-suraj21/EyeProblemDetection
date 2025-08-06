import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Search className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Search:</span>
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar; 