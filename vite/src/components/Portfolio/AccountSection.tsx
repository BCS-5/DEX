import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const AccountSection: React.FC = () => {
  const { totalValue, freeCollateral } = useSelector((state: RootState) => state.portfolio);

  return (
    <div className="bg-[#1E222D] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-[#f0f0f0]">Account</h2>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#72768f]">Total Value:</span>
          <span className="text-[#f0f0f0] font-semibold">${totalValue}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#72768f]">Free Collateral:</span>
          <span className="text-[#f0f0f0] font-semibold">${freeCollateral}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;