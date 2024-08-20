import { FC, useState } from "react";
import logo_USDT from "../images/staking/logo_USDT.png";
import logo_WBTC from "../images/staking/logo_WBTC.png";
import logo_WETH from "../images/staking/logo_WETH.png";
import PoolComposition from "../components/staking/PoolComposition";
import LiquidityProvision from "../components/staking/LiquidityProvision";
import Swaps from "../components/staking/Swaps";
import PoolDetails from "../components/staking/PoolDetails";
import { useMetamask } from "../lib";
import { setSigner } from "../features/providers/providersSlice";
import AddLiquidityModal from "../components/staking/AddLiquidityModal";
import Chart from "../components/staking/Chart";
import { useDispatch, useSelector } from "react-redux";
import { JsonRpcSigner } from "ethers";
import { RootState } from "../app/store";

const Pool: FC = () => {
  const [isStakingIncentivesOpen, setIsStakingIncentivesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { provider, signer } = useSelector(
    (state: RootState) => state.providers
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleAccordion = () => {
    setIsStakingIncentivesOpen(!isStakingIncentivesOpen);
  };

  const onClickConnectWallet = () => {
    provider?.getSigner().then((signer: JsonRpcSigner) => dispatch(setSigner(signer)));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] px-4 pt-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="text-2xl font-bold">Oracle Weighted Pool</div>
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
            Delegated swap fees; currently fixed: 0.09%
          </div>
        </div>
        <div className="hidden"></div>
        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-y-8">
            <Chart />

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
              <div className="col-span-2 my-10"></div>
            </div>

            <PoolComposition />
            <LiquidityProvision />
            <Swaps />
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
          {signer ? (
            <>
              <div className="flex justify-between bg-[#162031] font-bold p-4 rounded-t-xl">
                <div className="text-lg">My pool balance</div>
                <div className="text-2xl">$0.00</div>
              </div>
              <div className="bg-[#1E293B] p-4 mb-8 rounded-b-xl">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    onClick={openModal}
                  >
                    Add liquidity
                  </button>
                  <button className="h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Withdraw
                  </button>
                </div>
                <div className="pt-4 text-[#94A3B8] text-xs">
                  Liquidity Providers encounter risks when using DeFi and
                  조선안전 pools. Before proceeding, view this&nbsp;
                  <a className="font-medium text-[#60A5FA] hover:text-[#FED553] hover:underline">
                    pool's risks
                  </a>
                  .
                </div>
              </div>
              <div className="mx-auto flex max-w-screen-sm items-center justify-center">
                <div className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                  <div
                    className="flex flex-col rounded-xl h-full w-full items-center justify-center bg-gray-850"
                    onClick={toggleAccordion}
                  >
                    <div
                      className={`w-full bg-[#162031] ${
                        isStakingIncentivesOpen ? "rounded-t-xl" : "rounded-xl"
                      } border-b-2 border-b-[#0F172A]`}
                    >
                      <button className="flex justify-between w-full rounded-xl p-4 bg-[#162031] hover:bg-gray-800">
                        <div className="flex content-center font-bold">
                          <div className="content-center p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="feather feather-check rounded-full bg-green-500 text-white mr-2"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Staking incentives
                        </div>
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className={`feather feather-chevron-down text-blue-500 w-5 ${
                              isStakingIncentivesOpen
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </button>
                    </div>
                    {isStakingIncentivesOpen && (
                      <div className="w-full bg-[#162031] rounded-b-xl">
                        <div className="w-full p-4">
                          <div className="flex justify-between mb-2">
                            <div className="mr-4">Staked LP tokens</div>
                            <div className="flex">
                              <div className="mr-2">$0.00</div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-info text-gray-300"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                            </div>
                          </div>
                          <div className="flex justify-between mb-2">
                            <div className="mr-4">Unstaked LP tokens</div>
                            <div className="flex">
                              <div className="mr-2">$0.00</div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-info text-gray-300"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                            </div>
                          </div>
                          <div className="flex my-2">
                            <button className="h-9 px-3 bg-gray-700 text-gary-500 rounded-lg mr-2">
                              Stake
                            </button>
                            <button className="h-9 px-3 border border-gary-700 text-gray-700 rounded-lg">
                              Unstake
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <AddLiquidityModal isOpen={isModalOpen} onClose={closeModal} />
            </>
          ) : (
            <>
              <div className="bg-[#162031] font-bold text-lg p-4 rounded-t-xl">
                My pool balance
              </div>
              <div className="bg-[#1E293B] p-4 rounded-b-xl">
                <button
                  className="w-full h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  onClick={onClickConnectWallet}
                >
                  Connect wallet
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pool;