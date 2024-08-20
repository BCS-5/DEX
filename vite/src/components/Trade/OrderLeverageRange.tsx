import { FC, useEffect, useState } from "react";

interface OrderLeverageRangeParams {
  leverageValue: number;
  setLeverageValue: (value: string) => void;
  focusLeverage: boolean;
  setFocusLeverage: React.Dispatch<React.SetStateAction<boolean>>;
}

const leverage = ["1x", "100x"];
const OrderLeverageRange: FC<OrderLeverageRangeParams> = ({
  leverageValue,
  setLeverageValue,
  focusLeverage,
  setFocusLeverage,
}) => {
  //   const [focusLeverage, setFocusLeverage] = useState<boolean>(false);
  return (
    <div className="flex flex-col w-full mt-4">
      <div>Leverage </div>
      <div className="relative mb-6">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={leverageValue}
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
  );
};

export default OrderLeverageRange;
