import { FC, useEffect, useState } from "react";

interface OrderInfoParams {
  quoteValue: string;
  baseValue: string;
  leverageValue: number;
  isLong: boolean;
}

const OrderInfo: FC<OrderInfoParams> = ({
  quoteValue,
  baseValue,
  leverageValue,
  isLong,
}) => {
  const [entryPrice, setEntryPrice] = useState<string>("0.0");
  const [liquidationPrice, setLiquidationPrice] = useState<string>("0.00");
  const [fee, setFee] = useState<string>("0.00");

  useEffect(() => {
    if (!quoteValue || !baseValue) return;
    const _entryPrice =
      (Number(quoteValue) * leverageValue) / Number(baseValue);
    const _liquidationPrice = isLong
      ? _entryPrice - (Number(quoteValue) / Number(baseValue)) * 0.9
      : _entryPrice + (Number(quoteValue) / Number(baseValue)) * 0.9;
    const _fee = (Number(quoteValue) * leverageValue * 3) / 1e4;

    setEntryPrice(_entryPrice.toFixed(1).slice(0, 8));
    setLiquidationPrice(_liquidationPrice.toFixed(2).slice(0, 8));
    setFee(_fee.toFixed(2).slice(0, 8));
  }, [quoteValue, baseValue]);

  return (
    <div className="text-[12px] ">
      <div className="flex justify-between">
        <div>Entry Price </div>
        <div className="text-[#f0f0f0]">{entryPrice} USD</div>
      </div>
      <div className="flex justify-between">
        <div>Est. Liquidation Price</div>
        <div className="text-[#f0f0f0]">{liquidationPrice} USD</div>
      </div>
      <div className="flex justify-between">
        <div>Fees</div>
        <div className="text-[#f0f0f0]">{fee} USD</div>
      </div>
    </div>
  );
};

export default OrderInfo;