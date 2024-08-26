import React from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { contracts } from "../../contracts/addresses";
import OrderHistoryCard from "../Trade/OrderHistoryCard";

interface PortfolioPositionsProps {
  onDataUpdate: () => void;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({
  onDataUpdate,
}) => {
  const positions = useSelector((state: RootState) => state.history.positions);
  const { signer } = useSelector((state: RootState) => state.providers);

  const closePosition = async (positionId: string) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(
        contracts.clearingHouse.address,
        contracts.clearingHouse.abi,
        signer
      );
      const tx = await clearingHouseContract.closePosition(positionId);
      await tx.wait();
      toast.success("Position closed successfully.");
      onDataUpdate();
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error("Error closing position.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Positions</h2>
      <div className="grid grid-cols-7 gap-2 text-xs uppercase text-[#72768f] mb-2 bg-[#131722] ">
        <div>Pair</div>
        <div>Size</div>
        <div>Entry Price</div>
        <div>Mark Price</div>
        <div>PNL</div>
        <div>Liquidation Price</div>
        <div>Action</div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {positions.length ? (
          positions.map((position, index) => (
            <OrderHistoryCard key={index} type={0} position={position} />
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-[#72768f]">No Positions</div>
            <Link to="/trade" className="text-[#1DB1A8] text-xs">
              Open Position &gt;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPositions;
