import { FC } from "react";
import PoolTable from "../components/staking/PoolTable";
import stakingBanner from "../images/staking/staking_2.png";
import { useNavigate } from "react-router-dom";

const Staking: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <div className="mb-10">
        <div className="relative justify-center h-[280px] overflow-hidden">
          <img src={stakingBanner} className="w-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F8FAFC] text-center">
            <div className="font-bold text-5xl pb-2">DeFi liquidity pools</div>
            <div className="text-2xl mt-2">Built on fiX protocol</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-[1504px] w-full">
          <div className="flex border-b border-[#1E222D] gap-7 font-bold mx-5">
            <button className="border-b-2 border-[#AB71E2] text-xl text-[#AB71E2] py-2">
              Staking
            </button>
            <button
              className="text-xl text-[#F8FAFC] hover:text-[#FFFC7D] py-2"
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
