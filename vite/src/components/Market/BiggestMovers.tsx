import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const BiggestMovers: React.FC = () => {
  const [showGainers, setShowGainers] = useState(true);
  const markets = useSelector((state: RootState) => state.markets.list);
  
  const sortedMarkets = [...markets].sort((a, b) => 
    Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
  );

  const movers = sortedMarkets
    .filter(market => showGainers ? market.price_change_percentage_24h > 0 : market.price_change_percentage_24h < 0)
    .slice(0, 3);

  return (
    <div className="bg-[#1E1F31] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Biggest Movers 24H</h2>
        <div className="flex">
          <button
            className={`px-3 py-1 text-sm rounded-md ${showGainers ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
            onClick={() => setShowGainers(true)}
          >
            Gainers
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${!showGainers ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
            onClick={() => setShowGainers(false)}
          >
            Losers
          </button>
        </div>
      </div>
      {movers.map((market) => (
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

export default BiggestMovers;