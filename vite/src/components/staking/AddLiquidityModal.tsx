import { FC, useEffect, useRef, useState } from "react";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Tooltip from "./Tooltip";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { notify } from "../../lib";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolRatio: string;
  markPrice: string;
  pairAddr: string;
}

const AddLiquidityModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  poolRatio,
  markPrice,
  pairAddr,
}) => {
  if (!isOpen) return null;
  const { vaultContract, clearingHouseContract, virtualTokenContracts } =
    useSelector((state: RootState) => state.contracts);
  const { signer } = useSelector((state: RootState) => state.providers);
  const [deadline, setDeadline] = useState<string>("10");
  const [canAddLiquidity, setCanAddLiquidity] = useState<boolean>(false);
  const [addLiquidityLoading, setAddLiquidityLoading] =
    useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [inputUsdt, setInputUsdt] = useState<number | null>(null);
  const [inputBtc, setInputBtc] = useState<number | null>(null);
  const [inputBtcValue, setInputBtcValue] = useState<number | null>(null);
  const [totalAddLiquidityValue, setTotalAddLiquidityValue] = useState<
    number | null
  >(null);
  const [slippageTolerance, setSlippageTolerance] = useState<0.5 | 1.0 | 2.0>(
    0.5
  );
  const [isSlippageOpen, setIsSlippageOpen] = useState<boolean>(false);
  const divSlippageRef = useRef<HTMLDivElement>(null);

  // div 바깥을 클릭했을 때 호출되는 함수
  const handleClickOutside = (event: MouseEvent) => {
    if (
      divSlippageRef.current &&
      !divSlippageRef.current.contains(event.target as Node)
    ) {
      setIsSlippageOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const slippageAccordion = () => {
    setIsSlippageOpen(!isSlippageOpen);
  };

  const handleInputUsdtChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      setInputUsdt(numericValue);
    } else {
      setInputUsdt(null);
    }
  };

  const onClickAddLiquidity = async () => {
    if (!clearingHouseContract) return;

    try {
      const contractWithSigner = clearingHouseContract.connect(signer);

      setAddLiquidityLoading(true);

      const calculateQuoteMinimum =
        Number(inputUsdt) * (1 - slippageTolerance / 100);
      const calculateBaseTokenMinimum =
        Number(inputBtcValue) * (1 - slippageTolerance / 100);
      // const maxUint256 = (BigInt(1) << BigInt(256)) - BigInt(1);
      const deadline = Math.floor(Date.now() / 1000) + 5 * 60;

      // if (
      //   Number(inputUsdt) > ethers.MaxUint256 ||
      //   calculateQuoteMinimum > ethers.MaxUint256 ||
      //   calculateBaseTokenMinimum > ethers.MaxUint256
      // ) {
      //   throw new Error("Input value exceeds uint256 limit.");
      // }

      // console.log(ethers.parseUnits(Number(inputUsdt).toString(), 18));
      // console.log(ethers.parseUnits(calculateQuoteMinimum.toString(), 18));
      // console.log(ethers.parseUnits(calculateBaseTokenMinimum.toString(), 18));
      // LP 24개 얻는 코드
      // const tx = await contractWithSigner.addLiquidity(
      //   virtualTokenContracts.BTC.target,
      //   610n,
      //   0n,
      //   0n,
      //   deadline
      // );
      const tx = await contractWithSigner.addLiquidity(
        virtualTokenContracts.BTC.target,
        BigNumber.from(
          ethers.parseUnits(Number(inputUsdt).toString(), 6)
        ).toString(),
        0n,
        0n,
        deadline
      );
      // console.log(BigNumber.from(inputUsdt).toString());
      // console.log(calculateQuoteMinimum);
      // console.log(calculateBaseTokenMinimum);
      // console.log(BigNumber.from(calculateQuoteMinimum).toString());
      // console.log(BigNumber.from(calculateBaseTokenMinimum).toString());
      // const tx = await contractWithSigner.addLiquidity(
      //   virtualTokenContracts.BTC.target,
      //   BigNumber.from(inputUsdt).toString(),
      //   BigNumber.from(calculateQuoteMinimum).toString(),
      //   BigNumber.from(calculateBaseTokenMinimum).toString(),
      //   deadline
      // );

      await tx
        .wait()
        .then(() => notify("Transaction confirmed successfully !", true));
      console.log("Liquidity added successfully");
    } catch (error) {
      console.error("Error adding liquidity: ", error);
    } finally {
      setAddLiquidityLoading(false);
      onClose;
    }
  };

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (vaultContract) {
        try {
          const balance = await vaultContract.getTotalCollateral(
            signer?.address
          );
          setUserBalance((Number(balance) / 10 ** 6).toString());
          // console.log("user balance:  ", balance);
        } catch (error) {
          console.error("Error fetching user balance:", error);
        }
      } else {
        console.warn("vaultContract.getTotalCollateral is null or undefined");
      }
    };

    fetchUserBalance();
  }, [vaultContract, signer]);

  useEffect(() => {
    if (!inputUsdt) {
      setInputBtc(null);
      setInputBtcValue(null);
      setTotalAddLiquidityValue(null);
    } else {
      setInputBtc(inputUsdt * Number(poolRatio));
    }
  }, [inputUsdt]);

  useEffect(() => {
    if (!inputBtc) return;
    setInputBtcValue(inputBtc * Number(markPrice));
  }, [inputBtc]);

  useEffect(() => {
    if (!inputUsdt || !inputBtcValue) return;
    setTotalAddLiquidityValue(inputUsdt + inputBtcValue);
  }, [inputUsdt, inputBtcValue]);

  useEffect(() => {
    if (Number(inputUsdt) > 0 && Number(inputUsdt) <= Number(userBalance)) {
      setCanAddLiquidity(true);
    } else {
      setCanAddLiquidity(false);
    }
  }, [inputUsdt, userBalance]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-[#162031] w-[435px] rounded-lg shadow-lg relative z-10">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="w-full p-4 pb-0">
          <div className="text-[#94A3B8] text-xs">Sepolia</div>
          <div className="flex justify-between content-center h-11 font-bold text-xl">
            <div className="content-center">Add liquidity</div>
            <div>
              <div
                className="w-9 relative"
                onClick={slippageAccordion}
                ref={divSlippageRef}
              >
                <div>
                  <button className="w-9 h-9 bg-gray-800 rounded-full transform transition-all duration-300 hover:rotate-[-30deg] hover:text-blue-500 group">
                    <div className="flex content-center justify-center">
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
                        className="feather feather-settings group-hover:scale-125"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                {isSlippageOpen && (
                  <div className="absolute top-10 right-0 p-4 bg-[#1E293B] rounded-lg border border-gray-900 text-base">
                    <div className="text-[#F8FAFC] font-semibold mb-2">
                      Slippage tolerance
                    </div>
                    <div className="flex gap-2 h-9 content-center font-normal">
                      <button
                        className={`px-3 rounded-xl border ${
                          slippageTolerance === 0.5
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setSlippageTolerance(0.5)}
                      >
                        0.5%
                      </button>
                      <button
                        className={`px-3 rounded-xl border ${
                          slippageTolerance === 1.0
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setSlippageTolerance(1.0)}
                      >
                        1.0%
                      </button>
                      <button
                        className={`px-3 rounded-xl border ${
                          slippageTolerance === 2.0
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setSlippageTolerance(2.0)}
                      >
                        2.0%
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-[#1E293B] rounded-xl p-2 mb-4">
            <div className="flex justify-between p-1 h-12">
              <div className="flex content-center mr-2 px-4 rounded-xl bg-[#334155]">
                <div className="content-center">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                </div>
                <span className="content-center">USDT</span>
              </div>
              <input
                type="number"
                value={inputUsdt ? inputUsdt : ""}
                onChange={handleInputUsdtChange}
                className="text-xl text-right h-10 bg-[#1E293B] focus:outline-none"
                placeholder="0.0"
              />
            </div>
            <div className="flex justify-between p-1 pt-2 text-sm text-[#94A3B8]">
              <div>Balance: {Number(userBalance)}</div>
              {inputUsdt && <div>${inputUsdt.toFixed(2)}</div>}
            </div>
            {Number(userBalance) < Number(inputUsdt) && (
              <div className="text-sm text-red-500 font-semibold px-1">
                Exceeds wallet balance
              </div>
            )}
          </div>
          <div className="bg-[#1E293B] rounded-xl p-2 mb-4">
            <div className="flex justify-between p-1 h-12">
              <div className="flex content-center mr-2 px-4 rounded-xl bg-[#334155]">
                <div className="content-center">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                </div>
                <span className="content-center">BTC</span>
              </div>
              <input
                type="number"
                value={inputBtc ? inputBtc?.toFixed(10) : ""}
                className="text-xl text-right h-10 bg-[#1E293B] focus:outline-none"
                placeholder="0.0"
                readOnly
              />
            </div>
            <div className="flex justify-between p-1 pt-2 text-sm text-[#94A3B8]">
              <div>&nbsp;</div>
              {inputBtc && <div>${inputBtcValue?.toFixed(2)}</div>}
            </div>
          </div>
          <div>
            <table className="w-full border border-[#0F172A] rounded-xl">
              <tbody>
                <tr className="font-bold h-11 bg-[#1E293B]">
                  <td className="w-32 p-2 content-center border border-[#0F172A]">
                    Total
                  </td>
                  <td className="p-2 content-center border border-[#0F172A]">
                    {totalAddLiquidityValue
                      ? "$" + totalAddLiquidityValue.toFixed(2)
                      : "$0.00"}
                  </td>
                </tr>
                <tr className="h-9 bg-[#162031]">
                  <td className="p-2 border border-[#0F172A]">LP tokens</td>
                  <td className="p-2 border border-[#0F172A]">
                    <div className="flex">
                      0
                      <Tooltip text="LP tokens you are expected to receive, not including possible slippage.">
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
                  </td>
                </tr>
                <tr className="h-9 bg-[#1E293B]">
                  <td className="p-2 border border-[#0F172A]">Price impact</td>
                  <td className="p-2 border border-[#0F172A]">
                    <div className="flex">
                      0.00%
                      <Tooltip text="Adding custom amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees.">
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className={`gap-4 w-full h-12 text-center font-bold content-center mt-4 rounded-lg ${
              canAddLiquidity
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
                : "bg-gray-700 text-[#94A3B8] cursor-not-allowed"
            } ${addLiquidityLoading && "animate-pulse cursor-not-allowed"}`}
            onClick={onClickAddLiquidity}
            // disabled={addLiquidityLoading}
          >
            {addLiquidityLoading ? "Loading" : "Add Liquidity"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;
