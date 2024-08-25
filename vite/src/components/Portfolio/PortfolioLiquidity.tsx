import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';

interface PortfolioLiquidityProps {
  onDataUpdate: () => void;
}

const PortfolioLiquidity: React.FC<PortfolioLiquidityProps> = ({ onDataUpdate }) => {
  const liquidityPositions = useSelector((state: RootState) => state.portfolio.liquidityPositions);
  const { signer } = useSelector((state: RootState) => state.providers);

  const removeLiquidity = async (poolAddress: string, amount: string) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const tx = await clearingHouseContract.removeLiquidity(poolAddress, amount);
      await tx.wait();
      toast.success("유동성이 성공적으로 제거되었습니다.");
      onDataUpdate();
    } catch (error) {
      console.error("Error removing liquidity:", error);
      toast.error("유동성 제거 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-[#f0f0f0]">Liquidity Positions</h2>
      <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-[#f0f0f0]">
      <thead className="text-xs uppercase bg-[#131722]">
          <tr className="text-[#72768f] text-xs">
          <th className="px-6 py-2">Pool</th>
          <th className="px-6 py-2">Amount</th>
          <th className="px-6 py-2">Value Locked</th>
          <th className="px-6 py-2">Fees Earned</th>
          <th className="px-6 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {liquidityPositions.length > 0 ? (
            liquidityPositions.map((position, index) => (
              <tr key={index} className="border-b border-[#2A2E39] hover:bg-[#1E222D]">
                <td className="px-6 py-4">{position.pool}</td>
                <td className="px-6 py-4">{position.amount}</td>
                <td className="px-6 py-4">{position.valueLocked}</td>
                <td className="px-6 py-4">{position.feesEarned}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeLiquidity(position.poolAddress, position.amount)}
                    className="bg-[#1DB1A8] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <div className="text-[#72768f]">No Liquidity Positions</div>
                <Link to="/liquidity" className="text-[#1DB1A8] text-xs">Add Liquidity &gt;</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PortfolioLiquidity;