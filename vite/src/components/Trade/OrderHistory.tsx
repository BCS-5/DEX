import { FC } from "react";
const OrderHistory: FC = () => {
  return (
    <div className="flex flex-col w-full h-full bg-red-100">
      <div className="flex justify-between w-full h-12 items-center px-4">
        <div className="flex gap-4 ">
          <div>Position</div>
          <div>Open Order</div>
          <div>Trade History</div>
          <div>Order History</div>
          <div>Funding History</div>
        </div>
        <div className="flex">
          <div>All My Position &gt;</div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default OrderHistory;
