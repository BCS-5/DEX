import { FC } from "react";
import logo_USDT from "../images/staking/logo_USDT.png";
import logo_WBTC from "../images/staking/logo_WBTC.png";
import logo_WETH from "../images/staking/logo_WETH.png";
import PoolComposition from "../components/staking/PoolComposition";
import LiquidityProvisionTable from "../components/staking/LiquidityProvisionTable";
import SwapsTable from "../components/staking/SwapsTable";
import PoolDetails from "../components/staking/PoolDetails";

const Pool: FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] px-4 pt-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="text-2xl font-bold">Weighted Pool</div>
          <div className="flex gap-2 pt-2">
            <div className="flex gap-2 px-3 h-10 bg-[#162031] text-lg rounded-lg">
              <div className="h-full content-center">
                <img
                  src={logo_WBTC}
                  alt="logo_WBTC"
                  className="w-6 h-6 rounded-full"
                />
              </div>
              <div className="content-center">BTC</div>
              <div className="w-auto content-center text-sm text-[#94A3B8]">
                80%
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
              <div className="content-center text-sm text-[#94A3B8]">20%</div>
            </div>
          </div>
          <div className="text-[#94A3B8] pt-2">
            Delegated swap fees; currently fixed: 0.5%
          </div>
        </div>
        <div className="hidden"></div>
        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-y-8">
            <div className="flex bg-[#162031] rounded-xl">
              <div className="m-5">
                <div className="flex items-center gap-4 h-[50px] font-semibold text-[#94A3B8] border-b">
                  <div>Volume</div>
                  <div>TVL</div>
                  <div>Fees</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#162031] rounded-xl p-4">
                <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
                  Pool value
                </div>
                <div className="text-xl text-[#F8FAFC]">$120385912</div>
              </div>
              <div className="bg-[#162031] rounded-xl p-4">
                <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
                  Volume (24h)
                </div>
                <div className="text-xl text-[#F8FAFC]">$2254939</div>
              </div>
              <div className="hidden"></div>
              <div className="bg-[#162031] rounded-xl p-4">
                <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
                  Fees (24h)
                </div>
                <div className="text-xl text-[#F8FAFC]">$7102.69</div>
              </div>
              <div className="bg-[#162031] rounded-xl p-4">
                <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
                  APR
                </div>
                <div className="text-xl text-[#F8FAFC]">1.86%</div>
              </div>
            </div>

            <PoolComposition />
            <div>
              <div className="text-2xl font-bold mb-3">Liquidity provision</div>
              <div className="w-fit text-[#60A5FA] font-bold border-b-2 border-b-[#60A5FA] py-3 mb-6">
                All liquidity provision&nbsp;
              </div>
              <LiquidityProvisionTable />
            </div>
            <div>
              <div className="text-2xl font-bold mb-5">Swaps</div>
              <SwapsTable />
            </div>
            <PoolDetails />
            <div>
              <div className="text-xl pb-2 font-bold">Pool management</div>
              <div className="text-base">
                The attributes of this pool are immutable, except for swap fees
                which can be edited via Governance.
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-[#162031] font-bold text-lg p-4 rounded-t-xl">
            My pool balance
          </div>
          <div className="bg-[#1E293B] p-4 rounded-b-xl">
            <button className="w-full h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Connect wallet
            </button>
          </div>
        </div>
        <div className="hidden"></div>
      </div>
    </div>
  );
};

export default Pool;
