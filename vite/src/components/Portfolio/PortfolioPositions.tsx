import React from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { contracts } from "../../contracts/addresses";
import OrderHistoryCard from "../Trade/OrderHistoryCard";

const PortfolioPositions: React.FC = () => {
  const positions = useSelector((state: RootState) => state.history.positions);
  const { signer } = useSelector((state: RootState) => state.providers);

  async (positionId: string) => {
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
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error("Error closing position.");
    }
  };

  return (
    <div className="bg-[#1E222D] rounded-lg shadow-lg">
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
