import React from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { contracts } from "../../contracts/addresses";
import OrderHistoryCard from "../Trade/OrderHistoryCard";

interface PortfolioOrdersProps {
  onDataUpdate: () => void;
}

const PortfolioOrders: React.FC<PortfolioOrdersProps> = ({ onDataUpdate }) => {
  const orders = useSelector((state: RootState) => state.history.orders);
  const { signer } = useSelector((state: RootState) => state.providers);

  async (orderId: string) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(
        contracts.clearingHouse.address,
        contracts.clearingHouse.abi,
        signer
      );
      const tx = await clearingHouseContract.cancelOrder(orderId);
      await tx.wait();
      toast.success("Order cancelled successfully.");
      onDataUpdate();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Open Orders</h2>
      <div className="grid grid-cols-5 gap-2 text-xs uppercase text-[#72768f] mb-2 bg-[#131722]">
        <div>Pair</div>
        <div>Type</div>
        <div>Size</div>
        <div>Price</div>
        <div>Action</div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {orders.length ? (
          orders.map((order, index) => (
            <OrderHistoryCard key={index} type={1} position={order} />
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-[#72768f]">No Open Orders</div>
            <Link to="/trade" className="text-[#1DB1A8] text-xs">
              Place Order &gt;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioOrders;
