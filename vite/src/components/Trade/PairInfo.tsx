import { FC } from "react";
import { MdArrowDropDown } from "react-icons/md";
const PairContainer: FC = () => {
  return (
    <div className="flex w-full h-[80px] px-5 bg-[#131722] text-[#f0f0f0] items-center border-b-[0.6px] border-[#363A45]">
      <div className="flex w-full pl-2 gap-4 ">
        <div className="flex items-center">
          <img
            src="https://api.synfutures.com/ipfs/icons/token/btc.png"
            className="w-6 h-6"
          />
          <div className="flex flex-col  justify-center ml-2 font-semibold">
            <button className="flex items-center gap-4">
              BTC/USD <MdArrowDropDown size={24} />
            </button>
          </div>
        </div>
        <div className="border-r-[0.6px] border-[#363A45]"></div>
        <div className="flex ml-1 mr-[6px] flex-col items-end justify-center">
          <div className="text-sm tracking-wide text-[#2BBDB5]  font-semibold">
            62,595
          </div>
          <span className="text-xs text-[#2BBDB5]">+4.12%</span>

          {/* <span className="text-xs text-[#2BBDB5]"></span> */}
        </div>
        <div className="border-r-[0.6px] border-[#363A45]"></div>
        <div className="flex  flex-col w-[45%] justify-center">
          <div className="flex w-full text-sm  font-semibold">
            <span className="flex-1">62,701</span>
            <span className="flex-1">7.9853 BTC</span>
            <span className="flex-1">3.2360 BTC</span>
            <span className="flex-1">$101.6M </span>
            <span className="flex-1 text-[#2BBDB5]">0.0029%</span>
            <span className="flex-1 text-[#FF5AB5]">-0.0029%</span>
          </div>
          <div className="flex w-full text-xs text-[#72768f]">
            <span className="flex-1">Index Price</span>
            <span className="flex-1">Long OI</span>
            <span className="flex-1">Short OI</span>
            <span className="flex-1">24H Volume</span>
            <span className="flex-1">1h Funding (Long)</span>
            <span className="flex-1">1h Funding (Short)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairContainer;
