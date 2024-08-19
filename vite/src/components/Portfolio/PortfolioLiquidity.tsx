import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';
import { Link } from 'react-router-dom';

interface LiquidityPosition {
  id: string;
  pair: string;
  amount: string;
  valueLocked: string;
  feesEarned: string;
}

interface PortfolioLiquidityProps {
  onUpdateData: () => void;
}

const PortfolioLiquidity: React.FC<PortfolioLiquidityProps> = ({ onUpdateData }) => {
  const [liquidityPositions, setLiquidityPositions] = useState<LiquidityPosition[]>([]);
  const { signer } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const fetchLiquidityPositions = async () => {
      if (!signer) return;
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const address = await signer.getAddress();
      const positions = await clearingHouseContract.getLiquidityPositions(address);
      setLiquidityPositions(positions);
    };

    fetchLiquidityPositions();
  }, [signer]);

  const removeLiquidity = async (poolAddress: string, liquidity: string) => {
    if (!signer) return;
    const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
    try {
      const tx = await clearingHouseContract.removeLiquidity(poolAddress, liquidity);
      await tx.wait();
      onUpdateData();
    } catch (error) {
      console.error("Error removing liquidity:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Liquidity Positions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
            <tr>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Value Locked</th>
              <th className="px-6 py-3">Fees Earned</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {liquidityPositions.length > 0 ? (
              liquidityPositions.map((position) => (
                <tr key={position.id} className="border-b border-[#2A2E39] hover:bg-[#1E222D]">
                  <td className="px-6 py-4">{position.pair}</td>
                  <td className="px-6 py-4">{position.amount}</td>
                  <td className="px-6 py-4">{position.valueLocked}</td>
                  <td className="px-6 py-4">{position.feesEarned}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeLiquidity(position.pair, position.amount)}
                      className="bg-[#363A45] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
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

export default PortfolioLiquidity;