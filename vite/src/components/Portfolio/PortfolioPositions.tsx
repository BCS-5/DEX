import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';

interface PortfolioPositionsProps {
  onDataUpdate: () => void;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({ onDataUpdate }) => {
  const positions = useSelector((state: RootState) => state.portfolio.positions);
  const { signer } = useSelector((state: RootState) => state.providers);

  const closePosition = async (positionId: string) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const tx = await clearingHouseContract.closePosition(positionId);
      await tx.wait();
      toast.success("포지션이 성공적으로 종료되었습니다.");
      onDataUpdate();
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error("포지션 종료 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-[#f0f0f0]">Positions</h2>
      <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-[#f0f0f0]">
      <thead className="text-xs uppercase bg-[#131722]">
          <tr className="text-[#72768f] text-xs">
          <th className="px-6 py-2">Pair</th>
          <th className="px-6 py-2">Size</th>
          <th className="px-6 py-2">Entry Price</th>
          <th className="px-6 py-2">Mark Price</th>
          <th className="px-6 py-2">PNL</th>
          <th className="px-6 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 ? (
            positions.map((position, index) => (
              <tr key={index} className="border-b border-[#2A2E3E] hover:bg-[#1E222D]">
                <td className="px-6 py-4">{position.pair}</td>
                <td className="px-6 py-4">{position.size}</td>
                <td className="px-6 py-4">{position.entryPrice}</td>
                <td className="px-6 py-4">{position.markPrice}</td>
                <td className="px-6 py-4">{position.pnl}</td>
                <td className="py-2">
                  <button
                    onClick={() => closePosition(position.id)}
                    className="bg-[#1DB1A8] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                <div className="text-[#72768f]">No Positions</div>
                <Link to="/trade" className="text-[#1DB1A8] text-xs">Open Position &gt;</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PortfolioPositions;