import React from 'react';

const MarketFilter: React.FC = () => {
  return (
    <div className="flex space-x-2 mb-4">
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Perpetuals</button>
      <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Spot</button>
    </div>
  );
}

export default MarketFilter;