import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import OrderHistoryCard from "../Trade/OrderHistoryCard";
import { Link } from "react-router-dom";

const PortfolioHistory: React.FC = () => {
  const history = useSelector((state: RootState) => state.history.history);

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-[#f0f0f0]">
        Trade History
      </h2>
      <div className="grid grid-cols-8 gap-1 text-sm uppercase text-[#72768f] mb-2 bg-[#131722] pl-16">
        <div className="font-bold h-8 flex items-center">Pair</div>
        <div className="font-bold h-8 flex items-center">Type</div>
        <div className="font-bold h-8 flex items-center">Pair</div>
        <div className="font-bold h-8 flex items-center">Price</div>
        <div className="font-bold h-8 flex items-center">Size</div>
        <div className="font-bold h-8 flex items-center">PNL</div>
        <div className="font-bold h-8 flex items-center">PNL</div>
        <div className="font-bold h-8 flex items-center">PNL</div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {history.length ? (
          history.map((trade, index) => (
            <OrderHistoryCard key={index} type={2} position={trade} />
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-[#72768f]">No Trade History</div>
            <Link to="/trade" className="text-[#1DB1A8] text-xs">
              Trade Now &gt;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioHistory;
