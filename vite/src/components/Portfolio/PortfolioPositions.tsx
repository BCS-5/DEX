import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';
import { Link } from 'react-router-dom';

interface Position {
  id: string;
  pair: string;
  size: string;
  entryPrice: string;
  markPrice: string;
  pnl: string;
  liquidationPrice: string;
}

interface PortfolioPositionsProps {
  onUpdateData: () => void;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({ onUpdateData }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const { signer } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!signer) return;
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const address = await signer.getAddress();
      const positionsData = await clearingHouseContract.getPositions(address);
      setPositions(positionsData);
    };

    fetchPositions();
  }, [signer]);

  const closePosition = async (positionId: string) => {
    if (!signer) return;
    const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
    try {
      const tx = await clearingHouseContract.closePosition(positionId);
      await tx.wait();
      onUpdateData();
    } catch (error) {
      console.error("Error closing position:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Positions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
            <tr>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Entry Price</th>
              <th className="px-6 py-3">Mark Price</th>
              <th className="px-6 py-3">PNL</th>
              <th className="px-6 py-3">Liquidation Price</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.length > 0 ? (
              positions.map((position) => (
                <tr key={position.id} className="border-b border-[#2A2E39] hover:bg-[#1E222D]">
                  <td className="px-6 py-4">{position.pair}</td>
                  <td className="px-6 py-4">{position.size}</td>
                  <td className="px-6 py-4">{position.entryPrice}</td>
                  <td className="px-6 py-4">{position.markPrice}</td>
                  <td className="px-6 py-4">{position.pnl}</td>
                  <td className="px-6 py-4">{position.liquidationPrice}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => closePosition(position.id)}
                      className="bg-[#363A45] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                    >
                      Close
                    </button>
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

export default PortfolioPositions;