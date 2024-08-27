import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import OrderHistoryCard from "../Trade/OrderHistoryCard";
import { Link } from "react-router-dom";

const PortfolioHistory: React.FC = () => {
  const history = useSelector((state: RootState) => state.history.history);

  return (
    <div className="bg-[#1E222D] rounded-lg shadow-lg">
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
