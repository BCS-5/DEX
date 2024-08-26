import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';

interface PortfolioOrdersProps {
  onDataUpdate: () => void;
}

const PortfolioOrders: React.FC<PortfolioOrdersProps> = ({ onDataUpdate }) => {
  const orders = useSelector((state: RootState) => state.portfolio.orders);
  const { signer } = useSelector((state: RootState) => state.providers);

  const cancelOrder = async (orderId: string) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const tx = await clearingHouseContract.cancelOrder(orderId);
      await tx.wait();
      toast.success("주문이 성공적으로 취소되었습니다.");
      onDataUpdate();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("주문 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-[#f0f0f0]">Open Orders</h2>
      <div className="overflow-x-auto"></div>
      <table className="w-full text-sm text-left text-[#f0f0f0]">
      <thead className="text-xs uppercase bg-[#131722]">
          <tr className="text-[#72768f] text-xs">
          <th className="px-6 py-2">Pair</th>
          <th className="px-6 py-2">Type</th>
          <th className="px-6 py-2">Size</th>
          <th className="px-6 py-2">Price</th>
          <th className="px-6 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index} className="border-t border-[#1E222D]">
                <td className="py-2 text-[#f0f0f0]">{order.pair}</td>
                <td className="py-2 text-[#f0f0f0]">{order.type}</td>
                <td className="py-2 text-[#f0f0f0]">{order.size}</td>
                <td className="py-2 text-[#f0f0f0]">{order.price}</td>
                <td className="py-2">
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-[#363A45] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <div className="text-[#72768f]">No Open Orders</div>
                <Link to="/trade" className="text-[#1DB1A8] text-xs">Place Order &gt;</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioOrders;