import { FC, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import OrderInput from "./OrderInput";

const leverage = ["1x", "100x"];
const dd = "start-[50%]";
const Order: FC = () => {
  const [isLong, setIsLong] = useState<boolean>(true);
  const [isMarket, setIsMarket] = useState<boolean>(true);

  const [quoteValue, _setQuoteValue] = useState<string>("0");
  const [baseValue, _setBaseValue] = useState<string>("0");

  const [isExactInput, setIsExactInput] = useState<boolean>(false);

  const [leverageValue, _setLeverageValue] = useState<number>(50);
  const [focusLeverage, setFocusLeverage] = useState<boolean>(false);

  const setQuoteValue = (value: string) => {
    setIsExactInput(true);
    _setQuoteValue(value);
  };

  const setBaseValue = (value: string) => {
    setIsExactInput(false);
    _setBaseValue(value);
  };

  const setLeverageValue = (value: string) => {
    _setLeverageValue(Number(value));
  };

  return (
    <div className="flex flex-col justify-between w-full h-full bg-[#171822] text-[#72768f] p-4 pt-7">
      <div className="flex flex-col">
        <div className="flex w-full items-center  h-10 justify-between rounded-[4px] bg-[#242534]">
          <button
            className={`flex justify-center items-center  w-full h-10 rounded-[4px]
              ${isLong ? "bg-[#1DB1A8] text-white" : ""}`}
            onClick={() => setIsLong(true)}
          >
            Long
          </button>
          <button
            className={`flex justify-center items-center  w-full h-10 rounded-[4px]
              ${isLong ? "" : "bg-[#fd5cb7] text-white"}`}
            onClick={() => setIsLong(false)}
          >
            Short
          </button>
        </div>
        <div className="flex w-full items-center  h-14 justify-between">
          <div className="flex gap-4">
            <button
              className={`${
                isMarket ? "text-[#f0f0f0]" : ""
              } hover:text-[#7e9aff]`}
              onClick={() => setIsMarket(true)}
            >
              Market
            </button>
            <button
              className={`${
                isMarket ? "" : "text-[#f0f0f0]"
              } hover:text-[#7e9aff]`}
              onClick={() => setIsMarket(false)}
            >
              Limit
            </button>
          </div>
          <button>
            <MdSettings size={18} />
          </button>
        </div>
        <div className="flex flex-col w-full gap-2">
          <OrderInput
            value={quoteValue}
            setValue={setQuoteValue}
            symbol="USDT"
          />
          <OrderInput value={baseValue} setValue={setBaseValue} symbol="BTC" />
        </div>
        <div className="flex flex-col w-full mt-4">
          <div>Leverage </div>
          <div className="relative mb-6">
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              onChange={(e) => setLeverageValue(e.target.value)}
              onMouseDown={() => setFocusLeverage(true)}
              onMouseUp={() => setFocusLeverage(false)}
              className="accent-[#584CEA] w-full h-1 rounded-lg  cursor-pointer"
            />
            <div className="flex justify-between">
              {leverage.map((v, i) => (
                <span
                  key={i}
                  className={`text-[12px] text-gray-500 dark:text-gray-400 -bottom-6`}
                >
                  {v}
                </span>
              ))}
            </div>
            {focusLeverage && (
              <div
                className={`flex justify-center absolute w-12 -top-8 bg-[#242534] px-2 py-1 rounded-[4px] -translate-x-6 shadow-2xl`}
                style={{ left: `${leverageValue}%` }}
              >
                {leverageValue}x
              </div>
            )}
          </div>
        </div>
        <div className="text-[12px] ">
          <div className="flex justify-between">
            <div>Entry Price </div>
            <div className="text-[#f0f0f0]">55,837.1 USD</div>
          </div>
          <div className="flex justify-between">
            <div>Est. Liquidation Price</div>
            <div className="text-[#f0f0f0]">50,037.1 USD</div>
          </div>
          <div className="flex justify-between">
            <div>Fees</div>
            <div className="text-[#f0f0f0]">1.3 USD</div>
          </div>
        </div>
        <button
          className="flex justify-center items-center rounded-[4px]  w-full  h-12 text-white mt-4"
          style={{ background: "linear-gradient(90deg, #e05fbb, #4250f4)" }}
        >
          Wallet Connect
        </button>
      </div>
    </div>
  );
};

export default Order;
