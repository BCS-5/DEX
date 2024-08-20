import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchMarkets } from '../features/markets/marketsSlice';
import MarketsSummary from '../components/Market/MarketsSummary';
import RecentlyListed from '../components/Market/RecentlyListed';
import BiggestMovers from '../components/Market/BiggestMovers';
import MarketsList from '../components/Market/MarketsList';
import { FiSearch } from 'react-icons/fi';

const Market: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const marketsStatus = useSelector((state: RootState) => state.markets.status);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('market_cap');

  useEffect(() => {
    if (marketsStatus === 'idle') {
      dispatch(fetchMarkets());
    }
  }, [marketsStatus, dispatch]);

  const categories = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'AI', 'NFT', 'Gaming'];

  return (
    <div className="flex flex-col min-h-screen bg-[#131722] text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Markets</h1>
          <button className="bg-[#3772FF] text-white px-6 py-2 rounded-md text-sm font-semibold">
            Add a market
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <MarketsSummary />
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <RecentlyListed />
            <BiggestMovers />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeCategory === category ? 'text-white bg-[#1E1F31] rounded-md' : 'text-[#777E90] hover:text-white'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets"
              className="w-64 py-2 pl-10 pr-4 bg-[#1E1F31] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#3772FF]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777E90]" />
          </div>
        </div>

        <MarketsList 
          searchTerm={searchTerm} 
          activeCategory={activeCategory} 
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
    </div>
  );
};

export default Market;