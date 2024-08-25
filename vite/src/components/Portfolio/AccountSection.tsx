import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface AccountSectionProps {
  totalValue: string;
}

const AccountSection: React.FC<AccountSectionProps> = ({ totalValue }) => {
  const freeCollateral = useSelector((state: RootState) => state.portfolio.freeCollateral);

  return (
    <div className="bg-[#131722] p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Account</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[#72768f]">Total Value:</span>
          <span className="text-[#f0f0f0] font-semibold">${totalValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#72768f]">Free Collateral:</span>
          <span className="text-[#f0f0f0] font-semibold">${freeCollateral}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;