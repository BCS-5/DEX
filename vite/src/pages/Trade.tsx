import { FC } from "react";

import Chart from "../components/Trade/Chart";
import Order from "../components/Trade/Order";
import OrderHistory from "../components/Trade/OrderHistory";

import PairContainer from "../components/Trade/PairContainer";

const Trade: FC = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-full">
        <div className="flex-[4] flex flex-col h-[calc(100vh-40px)]">
          <PairContainer />
          <div className="flex-[2]">
            <Chart />
          </div>
          <div className="flex-1">
            <OrderHistory />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex-[2]">
            <Order />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
