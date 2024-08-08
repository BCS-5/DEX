import { Provider } from "ethers";
import { FC, useEffect } from "react";
import { JsonRpcSigner } from "ethers";

interface OrderInputParams {
  value: string;
  setValue: (value: string) => void;
  symbol: string;
}

const OrderInput: FC<OrderInputParams> = ({ value, setValue, symbol }) => {
  useEffect(() => {
    if (Number(value) >= 1 && value[0] == "0") setValue(String(Number(value)));
  }, [value]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !Number.isNaN(Number(e.target.value)) &&
      e.target.value.substring(0, 2) !== "00"
    ) {
      setValue(e.target.value);
    }
  };

  return (
    <div className="relative flex items-center w-full h-12 bg-[#2c2d43] text-white rounded-[4px]">
      <input
        className="outline-none bg-transparent px-2 "
        placeholder="0"
        value={value}
        onChange={onChangeHandler}
      />
      <span className="absolute  right-2">{symbol}</span>
      {/* <button className="flex items-center justify-start rounded-[18px] bg-white p-1 px-2 gap-1 font-[700] text-[20px] h-10 min-w-28  shadow-token-button border border-token-button">
        USDT
      </button> */}
      <button className="absolute top-2 right-2 text-[14px]  font-semibold"></button>
    </div>
  );
};

export default OrderInput;
