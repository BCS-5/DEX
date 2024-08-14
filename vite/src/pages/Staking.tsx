import { FC } from "react";
import PoolTable from "../components/staking/PoolTable";
import stakingBanner from "../images/staking/staking_banner.svg";
import { useNavigate } from "react-router-dom";

const Staking: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <div className="mb-10">
        <div className="relative justify-center">
          <img src={stakingBanner} className="w-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <div className="font-bold text-5xl pb-2">DeFi liquidity pools</div>
            <div className="text-2xl mt-2">Built on 조선안전 protocol</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-[1504px] w-full">
          <div className="flex gap-3 font-bold">
            <button
              className="bg-[#1D283A] hover:bg-[#1E3A8A] text-white rounded-lg px-5 py-2 active:bg-[#1E3A8A]"
              onClick={() => navigate("/staking")}
            >
              Staking
            </button>
            <button
              className="bg-[#1D283A] hover:bg-[#1E3A8A] text-white rounded-lg px-5 py-2 active:bg-[#1E3A8A]"
              onClick={() => navigate("/claim")}
            >
              Claim
            </button>
          </div>
          <PoolTable />
        </div>
      </div>
    </div>
  );
};

export default Staking;
