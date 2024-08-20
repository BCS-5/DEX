import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const RecentlyListed: React.FC = () => {
  const markets = useSelector((state: RootState) => state.markets.list);
  const recentlyListed = markets.slice(0, 3);

  return (
    <div className="bg-[#1E1F31] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recently Listed</h2>
      {recentlyListed.map((market) => (
        <div key={market.id} className="flex justify-between items-center py-3 border-b border-[#2C2D43] last:border-b-0">
          <div className="flex items-center">
            <img src={market.image} alt={market.name} className="w-8 h-8 mr-3" />
            <div>
              <span className="font-medium">{market.symbol.toUpperCase()}</span>
              <span className="text-sm text-[#777E90] ml-2">{market.name}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">${market.current_price.toFixed(2)}</p>
            <p className={market.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
              {market.price_change_percentage_24h >= 0 ? '+' : ''}{market.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyListed;