import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { FiInfo } from 'react-icons/fi';

const MarketsSummary: React.FC = () => {
  const { tradingVolume, openInterest, earnedByStakers } = useSelector((state: RootState) => state.markets.summary);

  return (
    <div className="bg-[#1E1F31] p-6 rounded-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-[#777E90]">Trading Volume 24h</h3>
          <FiInfo className="text-[#777E90]" />
        </div>
        <p className="text-2xl font-bold">${tradingVolume.toLocaleString()}</p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-[#777E90]">Open Interest Current</h3>
          <FiInfo className="text-[#777E90]" />
        </div>
        <p className="text-2xl font-bold">${openInterest.toLocaleString()}</p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-[#777E90]">Earned by Stakers 24h</h3>
          <FiInfo className="text-[#777E90]" />
        </div>
        <p className="text-2xl font-bold">${earnedByStakers.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MarketsSummary;