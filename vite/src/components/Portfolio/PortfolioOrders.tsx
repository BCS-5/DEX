import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from '../../app/store';
import { contracts } from '../../contracts/addresses';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  pair: string;
  type: string;
  size: string;
  price: string;
  filled: string;
  status: string;
}

interface PortfolioOrdersProps {
  onUpdateData: () => void;
}

const PortfolioOrders: React.FC<PortfolioOrdersProps> = ({ onUpdateData }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { signer } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!signer) return;
      const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
      const address = await signer.getAddress();
      const ordersData = await clearingHouseContract.getOpenOrders(address);
      setOrders(ordersData);
    };

    fetchOrders();
  }, [signer]);

  const cancelOrder = async (orderId: string) => {
    if (!signer) return;
    const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
    try {
      const tx = await clearingHouseContract.cancelOrder(orderId);
      await tx.wait();
      onUpdateData();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Open Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
            <tr>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Filled</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2A2E39] hover:bg-[#1E222D]">
                  <td className="px-6 py-4">{order.pair}</td>
                  <td className="px-6 py-4">{order.type}</td>
                  <td className="px-6 py-4">{order.size}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.filled}</td>
                  <td className="px-6 py-4">{order.status}</td>
                  <td className="px-6 py-4">
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

export default PortfolioOrders;