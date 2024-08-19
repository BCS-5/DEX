import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const AccountBalance: React.FC = () => {
  const balances = useSelector((state: RootState) => state.account.balances);

  return (
    <div className="flex items-center">
      <div className="flex flex-col mr-4">
        {Object.entries(balances).map(([currency, balance]) => (
          <div key={currency} className="flex items-center mb-1">
            <img src={`/images/${currency.toLowerCase()}.png`} alt={currency} className="w-5 h-5 mr-2" />
            <span>{currency}</span>
            <span className="ml-2">{balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <button className="bg-[#1DB1A8] text-white px-4 py-2 rounded mr-2">Deposit</button>
      <button className="bg-[#363A45] text-white px-4 py-2 rounded">Withdraw</button>
    </div>
  );
};

export default AccountBalance;