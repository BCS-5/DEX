import { FC } from "react";
import claimBanner from "../images/staking/claim_banner.svg";
import { useNavigate } from "react-router-dom";

const Claim: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <div className="mb-10">
        <div className="relative justify-center">
          <img src={claimBanner} className="w-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F8FAFC] text-center">
            <div className="font-bold text-5xl pb-2">DeFi liquidity pools</div>
            <div className="text-2xl mt-2">Built on 조선안전 protocol</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-[1504px] w-full">
          <div className="flex gap-3 font-bold">
            <button
              className="bg-[#1D283A] hover:bg-[#1E3A8A] text-[#F8FAFC] rounded-lg px-5 py-2 active:bg-[#1E3A8A]"
              onClick={() => navigate("/staking")}
            >
              Staking
            </button>
            <button className="border border-[#3B82F6] bg-[#1E3A8A] text-[#F8FAFC] rounded-lg px-5 py-2 active:bg-[#1E3A8A]">
              Claim
            </button>
          </div>
          <div className="text-[#F8FAFC] py-12">
            <div className="mb-16">
              <div className="px-4 text-2xl font-bold">
                Ethereum liquidity incentives
              </div>
              <div className="px-4 mt-6 mb-2 font-semibold text-xl">
                BAL incentives
              </div>
              <table className="table-auto w-full bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
                <thead className="border-b-2 border-b-[#0F172A]">
                  <tr className="font-bold">
                    <th className="p-6 text-left">Pools</th>
                    <th className="p-6 text-left">Amount</th>
                    <th className="p-6 text-left">Value</th>
                    <th className="p-6 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#1e293b]">
                    <td className="p-6 text-[#94A3B8]">
                      No BAL incentives to claim from staking
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-16">
              <div className="px-4 mt-6 mb-2 font-semibold text-xl">
                Protocol revenue & veBAL incentives
              </div>
              <table className="table-auto w-full bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
                <thead className="border-b-2 border-b-[#0F172A]">
                  <tr className="font-bold">
                    <th className="p-6 text-left">Token</th>
                    <th className="p-6 text-left">Amount</th>
                    <th className="p-6 text-left">Value</th>
                    <th className="p-6 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#1e293b]">
                    <td className="p-6 text-[#94A3B8]">
                      Nothing to claim from holding veBAL
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="px-4 mt-6 mb-2 font-semibold text-xl">
                Other token incentives
              </div>
              <table className="table-auto w-full bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
                <tbody>
                  <tr>
                    <td className="p-6 text-[#94A3B8]">
                      No claimable incentives
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
