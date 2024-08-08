import { FC } from "react";
const PairContainer: FC = () => {
  return (
    <div className="flex w-full h-[94px] px-5 bg-[#131722] text-[#72768f] items-center border-r border-[#363A45]">
      <div className="flex w-full">
        <img
          src="https://api.synfutures.com/ipfs/icons/token/btc.png"
          className="w-10 h-10"
        />
        <div className="flex flex-col  justify-center ml-4">
          <span>BTC/USD</span>
          <span>PERP 33x</span>
        </div>
        <div className="flex flex-col items-end justify-center ml-4">
          <span>62,595</span>
          <span>+4.96</span>
        </div>
        <div className="flex flex-col justify-center ml-4 flex-1">
          <div className="flex w-full">
            <span className="flex-1">Index Price</span>
            <span className="flex-1">Mark Price</span>
            <span className="flex-1">Est. 1H Funding</span>
            <span className="flex-1">24H High</span>
            <span className="flex-1">24H Low</span>
            <span className="flex-1">24H Volume</span>
            <span className="flex-1"> Open Interest</span>
            <span className="flex-1">Long OI</span>
            <span className="flex-1">Short OI</span>
            <span className="flex-1">TVL</span>
          </div>
          <div className="flex w-full">
            <span className="flex-1">62,701</span>
            <span className="flex-1">62,701</span>
            <span className="flex-1">-0.0029%</span>
            <span className="flex-1">63,192 </span>
            <span className="flex-1">59,545</span>
            <span className="flex-1">$101.6M </span>
            <span className="flex-1">53.233BTC </span>
            <span className="flex-1">7.9853BTC</span>
            <span className="flex-1">3.2360BTC</span>
            <span className="flex-1">$2.574M</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairContainer;
