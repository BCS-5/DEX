import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Contract } from "ethers";
import Tooltip from "../components/staking/Tooltip";
import claimBanner from "../images/staking/staking_4.png";
import logo_USDT from "../images/staking/logo_USDT.png";
import logo_WBTC from "../images/staking/logo_WBTC.png";
import { notify } from "../lib";

const Claim: FC = () => {
  const navigate = useNavigate();
  const { pairContracts, vaultContract } = useSelector(
    (state: RootState) => state.contracts
  );
  const { signer } = useSelector((state: RootState) => state.providers);
  const [pairAddr, setPairAddr] = useState<string>("");
  const [UserLP, setUserLP] = useState<string>("");
  const { liquiditys } = useSelector((state: RootState) => state.history);
  const [lockedLiquidity, setLockedLiquidity] = useState<string>("");
  const [unclaimedLiquidity, setUnclaimedLiquidity] = useState<string>("");

  useEffect(() => {
    const fetchgetDetail = async () => {
      try {
        const pair = "BTC";
        const contract: Contract = pairContracts[pair];

        if (contract) {
          setPairAddr(pairContracts[pair].target.toString());
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchgetDetail();
  }, [pairContracts]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!signer) return;
      if (vaultContract) {
        try {
          const myLP = await vaultContract.getUserLP(signer?.address, pairAddr);
          setUserLP(myLP);
          console.log("user LP:  ", myLP);
        } catch (error) {
          console.error("Error fetching user LP:", error);
        }
      } else {
        console.warn("vaultContract.getUserLP is null or undefined");
      }
    };

    fetchUserBalance();
  }, [vaultContract, signer, pairAddr]);

  useEffect(() => {
    console.log("liquiditys.locked: ", liquiditys[0]?.locked);
    console.log("liquiditys.unClaimedFees: ", liquiditys[0]?.unClaimedFees);
    setLockedLiquidity(
      (Number(liquiditys[0]?.locked) / 10 ** 6).toFixed(6).toLocaleString()
    );
    setUnclaimedLiquidity(
      (Number(liquiditys[0]?.unClaimedFees) / 10 ** 6)
        .toFixed(6)
        .toLocaleString()
    );
  }, [liquiditys]);

  const onClickClaim = async () => {
    if (!signer) return;
    if (vaultContract) {
      try {
        vaultContract
          .claimRewards(signer?.address, pairAddr)
          .then((tx) => {
            notify("Pending Transaction ...", true);
            tx.wait().then(() => {
              notify("Transaction confirmed successfully !", true);
            });
          })
          .catch((error) => notify(error.shortMessage, false));

        console.log("Claim successfully");
      } catch (error) {
        console.error("Error fetching claim LP:", error);
      }
    } else {
      console.warn("vaultContract.claimRewards is null or undefined");
    }
  };

  useEffect(() => {
    const fetchgetDetail = async () => {
      try {
        const pair = "BTC";
        const contract: Contract = pairContracts[pair];

        if (contract) {
          setPairAddr(pairContracts[pair].target.toString());
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchgetDetail();
  }, [pairContracts]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!signer) return;
      if (vaultContract) {
        try {
          const myLP = await vaultContract.getUserLP(signer?.address, pairAddr);
          setUserLP(myLP);
          console.log("user LP:  ", myLP);
        } catch (error) {
          console.error("Error fetching user LP:", error);
        }
      } else {
        console.warn("vaultContract.getUserLP is null or undefined");
      }
    };

    fetchUserBalance();
  }, [vaultContract, signer]);
  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <div className="mb-10">
        <div className="relative justify-center h-[280px] overflow-hidden">
          <img src={claimBanner} className="w-full" />
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F8FAFC] text-center">
            <div className="px-10 pl-40">
              <div className="flex grid-cols-2">
                <div className="py-4 text-left w-[33%]">
                  <div className="mb-3 text-4xl font-bold">
                    Claim liquidity incentives
                  </div>
                  <div>
                    fiX Protocol liquidity incentives are directed to pools by
                    veBAL voters. Stake in these pools to earn incentives. Boost
                    with veBAL for up to 2.5x extra.
                  </div>
                </div>
                <div className=""></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-[1504px] w-full">
          <div className="flex border-b border-[#1E222D] gap-7 font-bold mx-5">
            <button
              className="text-xl text-[#F8FAFC] hover:text-[#FFFC7D] py-2"
              onClick={() => navigate("/staking")}
            >
              Staking
            </button>
            <button className="border-b-2 border-[#AB71E2] text-xl text-[#AB71E2] py-2">
              Claim
            </button>
          </div>
          <div className="text-[#F8FAFC] py-12">
            <div className="mb-16">
              <div className="px-4 text-2xl font-bold">
                Ethereum liquidity incentives
              </div>
              <div className="flex px-4 mt-6 mb-2 font-semibold text-xl">
                LP incentives
                <div className="content-center text-[#94A3B8] ml-2">
                  <Tooltip text="Incentives for LPs who stake in eligible pools (based on the previous week's voting). This doesn't include swap fees or intrinsic yield from certain yield-bearing tokens which accumulate into LP positions automatically.">
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
                      className="feather feather-info cursor-pointer"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </Tooltip>
                </div>
              </div>
              <table className="table-auto w-full bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
                <thead className="border-b-2 border-b-[#0F172A]">
                  <tr className="font-bold">
                    <th className="p-6 text-left">Pools</th>
                    <th className="p-6 text-left"></th>
                    <th className="p-6 text-left">Amount</th>
                    <th className="p-6 text-left">Value</th>
                    <th className="p-6 text-left">Unclaimed Fee</th>
                    <th className="p-6 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {Number(UserLP) > 0 ? (
                    <tr className="hover:bg-[#1e293b]">
                      <td className="px-6 py-4">
                        <div className="flex">
                          <img
                            src={logo_WBTC}
                            alt="logo_WBTC"
                            className="w-7 rounded-full"
                          />
                          <img
                            src={logo_USDT}
                            alt="logo_WBTC"
                            className="w-7 rounded-full"
                          />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex h-full gap-2">
                          <div className="flex content-center gap-2 px-3 bg-[#334155] text-lg rounded-lg">
                            BTC
                            <div className="w-auto content-center text-sm text-[#94A3B8]">
                              50%
                            </div>
                          </div>
                          <div className="flex content-center gap-2 px-3 bg-[#334155] text-lg rounded-lg">
                            USDT
                            <div className="w-auto content-center text-sm text-[#94A3B8]">
                              50%
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {Number(UserLP).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        ${Number(lockedLiquidity).toFixed(6).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        $
                        {Number(unclaimedLiquidity).toFixed(6).toLocaleString()}
                      </td>
                      <td className="pr-10 py-4 text-right">
                        <button
                          className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
                          onClick={onClickClaim}
                        >
                          Claim
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr className="hover:bg-[#1e293b]">
                      <td className="p-6 text-[#94A3B8]">
                        No LP incentives to claim from staking
                      </td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  )}
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
