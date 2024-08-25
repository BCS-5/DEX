import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Link } from 'react-router-dom';

const PortfolioHistory: React.FC = () => {
  const tradeHistory = useSelector((state: RootState) => state.portfolio.tradeHistory);

  // 거래 내역을 시간순으로 정렬
  const sortedHistory = [...tradeHistory].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
          <tr className="text-[#72768f] text-xs">
            <th className="px-6 py-2">Time</th>
            <th className="px-6 py-2">Type</th>
            <th className="px-6 py-2">Pair</th>
            <th className="px-6 py-2">Price</th>
            <th className="px-6 py-2">Size</th>
            <th className="px-6 py-2">PNL</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.length > 0 ? (
              sortedHistory.map((trade, index) => (
                <tr key={index} className="border-b border-[#2A2E3E] hover:bg-[#1E222D]">
                  <td className="px-6 py-4">{new Date(trade.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">{trade.type}</td>
                  <td className="px-6 py-4">{trade.pair}</td>
                  <td className="px-6 py-4">{trade.price}</td>
                  <td className="px-6 py-4">{trade.size}</td>
                  <td className={`px-6 py-4 ${Number(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
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