import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';
import { Link } from 'react-router-dom';

interface TradeHistoryItem {
  id: string;
  timestamp: number;
  pair: string;
  type: string;
  side: string;
  size: string;
  price: string;
  pnl: string;
}

const PortfolioHistory: React.FC = () => {
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const { signer } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      if (!signer) return;
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const address = await signer.getAddress();
      const history = await clearingHouseContract.getTradeHistory(address);
      setTradeHistory(history);
    };

    fetchTradeHistory();
  }, [signer]);

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Side</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">PNL</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.length > 0 ? (
              tradeHistory.map((trade) => (
                <tr key={trade.id} className="border-b border-[#2A2E3E] hover:bg-[#1E222D]">
                  <td className="px-6 py-4">{new Date(trade.timestamp * 1000).toLocaleString()}</td>
                  <td className="px-6 py-4">{trade.pair}</td>
                  <td className="px-6 py-4">{trade.type}</td>
                  <td className="px-6 py-4">{trade.side}</td>
                  <td className="px-6 py-4">{trade.size}</td>
                  <td className="px-6 py-4">{trade.price}</td>
                  <td className={`px-6 py-4 ${Number(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <div className="text-[#72768f]">No Record</div>
                  <Link to="/trade" className="text-[#1DB1A8] text-xs">Trade Now &gt;</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioHistory;