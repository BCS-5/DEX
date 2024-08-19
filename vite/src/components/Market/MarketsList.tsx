import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface MarketsListProps {
  searchTerm: string;
  activeCategory: string;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

const MarketsList: React.FC<MarketsListProps> = ({ searchTerm, activeCategory, sortBy, setSortBy }) => {
  const markets = useSelector((state: RootState) => state.markets.list);

  const filteredMarkets = markets.filter(market => 
    (market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategory === 'All' || market.category === activeCategory)
  );

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return b.current_price - a.current_price;
    if (sortBy === 'change') return b.price_change_percentage_24h - a.price_change_percentage_24h;
    if (sortBy === 'volume') return b.total_volume - a.total_volume;
    return b.market_cap - a.market_cap;
  });

  const handleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortBy(`${newSortBy}_reverse`);
    } else {
      setSortBy(newSortBy);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy === column) return <FiArrowUp className="inline ml-1" />;
    if (sortBy === `${column}_reverse`) return <FiArrowDown className="inline ml-1" />;
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-[#777E90] border-b border-[#2C2D43]">
            <th className="text-left py-4 px-4 cursor-pointer" onClick={() => handleSort('name')}>
              Market <SortIcon column="name" />
            </th>
            <th className="text-right py-4 px-4 cursor-pointer" onClick={() => handleSort('price')}>
              Oracle Price <SortIcon column="price" />
            </th>
            <th className="text-right py-4 px-4 cursor-pointer" onClick={() => handleSort('change')}>
              24h Change <SortIcon column="change" />
            </th>
            <th className="text-right py-4 px-4 cursor-pointer" onClick={() => handleSort('volume')}>
              24h Volume <SortIcon column="volume" />
            </th>
            <th className="text-right py-4 px-4 cursor-pointer" onClick={() => handleSort('market_cap')}>
              Market Cap <SortIcon column="market_cap" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMarkets.map((market) => (
            <tr key={market.id} className="border-b border-[#2C2D43] hover:bg-[#1E1F31]">
              <td className="py-4 px-4">
                <div className="flex items-center">
                <img src={market.image} alt={market.name} className="w-8 h-8 mr-3" />
                  <div>
                    <p className="font-medium">{market.name}</p>
                    <p className="text-sm text-[#777E90]">{market.symbol.toUpperCase()}</p>
                  </div>
                </div>
              </td>
              <td className="text-right py-4 px-4">${market.current_price.toFixed(2)}</td>
              <td className={`text-right py-4 px-4 ${market.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <div className="flex items-center justify-end">
                  {market.price_change_percentage_24h >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                  {Math.abs(market.price_change_percentage_24h).toFixed(2)}%
                </div>
              </td>
              <td className="text-right py-4 px-4">${market.total_volume.toLocaleString()}</td>
              <td className="text-right py-4 px-4">${market.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketsList;