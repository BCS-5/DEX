import { FC } from "react";
import { MdSettings } from "react-icons/md";
const Order: FC = () => {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-blue-100 p-6 pt-4">
      <div className="flex flex-col">
        <div className="flex w-full items-center  h-14 justify-between">
          <div className="flex gap-4">
            <div className="">Market</div>
            <div className="">Limit</div>
          </div>
          <button>
            <MdSettings size={18} />
          </button>
        </div>
        <div className="flex w-full items-center  h-14 justify-between">
          <button className="flex justify-center items-center  w-full h-10 bg-green-300">
            Long
          </button>
          <button className="flex justify-center items-center  w-full h-10 bg-red-300">
            Short
          </button>
        </div>
        <div className="flex flex-col w-full gap-2 mt-4">
          <div>Size</div>
          <div className="flex items-center w-full h-12 bg-[#101A27] text-white">
            <input className="outline-none bg-transparent " placeholder="0" />
          </div>
          <div className="flex items-center w-full h-12 bg-[#101A27] text-white">
            <input className="outline-none bg-transparent " placeholder="0" />
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 mt-4">
          <div>Leverage</div>
          <div className="flex items-center w-full h-12 bg-[#101A27] text-white">
            <input
              type="range"
              min="1"
              max="100"
              className="w-full outline-none opacity-70 transition-opacity"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-between">
            <div>Est. Liquidation Price</div>
            <div>0</div>
          </div>
          <div className="flex justify-between">
            <div>Fees</div>
            <div>0</div>
          </div>
        </div>
        <button className="flex justify-center items-center bg w-full bg-[#101A27] h-12 text-white">
          Wallet Connect
        </button>
      </div>
    </div>
  );
};

export default Order;
