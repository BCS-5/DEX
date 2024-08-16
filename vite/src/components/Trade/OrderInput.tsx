import { Provider } from "ethers";
import { FC, useEffect } from "react";
import { JsonRpcSigner } from "ethers";

interface OrderInputParams {
  value: string;
  setValue: (value: string) => void;
  symbol: string;
  placeholder: string;
}

const pattern = /^[0-9]*\.?[0-9]*$/;

const OrderInput: FC<OrderInputParams> = ({
  value,
  setValue,
  symbol,
  placeholder,
}) => {
  useEffect(() => {
    if (Number(value) >= 1 && value[0] == "0") setValue(String(Number(value)));
  }, [value]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pattern.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  return (
    <div className="relative flex items-center w-full h-12 bg-[#2c2d43] text-white rounded-[4px]">
      <input
        type="text"
        className="outline-none bg-transparent px-2 "
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
      />
      <span className="absolute  right-2">{symbol}</span>
      <button className="absolute top-2 right-2 text-[14px]  font-semibold"></button>
    </div>
  );
};

export default OrderInput;
