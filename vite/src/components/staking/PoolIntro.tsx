import { FC } from "react";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";
import Tooltip from "./Tooltip";

interface PoolIntroProps {
  pairAddr: string;
}

const PoolIntro: FC<PoolIntroProps> = ({ pairAddr }) => {
  return (
    <div className="col-span-2">
      <div className="text-2xl font-bold">Oracle Weighted Pool</div>
      <div className="flex gap-2 pt-2">
        <div className="flex gap-2 px-3 h-10 bg-[#162031] text-lg rounded-lg">
          <div className="h-full content-center">
            <img
              src={logo_WBTC}
              alt={`logo_WBTC`}
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="content-center">BTC</div>
          <div className="w-auto content-center text-sm text-[#94A3B8]">
            50%
          </div>
        </div>
        <div className="flex gap-2 px-3 h-10 bg-[#162031] text-lg rounded-lg">
          <div className="h-full content-center">
            <img
              src={logo_USDT}
              alt="logo_USDT"
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="content-center">USDT</div>
          <div className="content-center text-sm text-[#94A3B8]">50%</div>
        </div>
        <div className="content-center">
          <a
            href={`https://sepolia.etherscan.io/address/${pairAddr}`}
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-up-right inline text-gray-500 hover:text-blue-500"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      </div>
      <div className="flex text-[#94A3B8] pt-2">
        Delegated swap fees; currently fixed: 0.03%
        <Tooltip text="Liquidity providers in this pool earn fixed swap fees on every swap utilizing the liquidity in this pool. Control has been delegated to the community, so fees could change in the future if this pool becomes actively managed.">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-info cursor-pointer ml-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </Tooltip>
      </div>
    </div>
  );
};

export default PoolIntro;
