import { FC, useEffect, useRef, useState } from "react";
import logo_LP from "../../images/staking/logo_LP.png";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { notify } from "../../lib";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLP: string;
}

const RemoveLiquidityModal: FC<ModalProps> = ({ isOpen, onClose, userLP }) => {
  if (!isOpen) return null;
  const { clearingHouseContract, virtualTokenContracts, pairContracts } =
    useSelector((state: RootState) => state.contracts);

  const [deadline, setDeadline] = useState<number>(10);
  const [canRemoveLiquidity, setCanRemoveLiquidity] = useState<boolean>(false);
  const [removeLiquidityLoading, setRemoveLiquidityLoading] =
    useState<boolean>(false);
  const [inputLP, setinputLP] = useState<number | null>(null);
  const [inputLPValue, setInputLPValue] = useState<string>("");
  const [slippageTolerance, setSlippageTolerance] = useState<0.5 | 1.0 | 2.0>(
    0.5
  );
  const [isSlippageOpen, setIsSlippageOpen] = useState<boolean>(false);
  const divSlippageRef = useRef<HTMLDivElement>(null);
  const { liquiditys } = useSelector((state: RootState) => state.history);
  const [lockedLiquidity, setLockedLiquidity] = useState<string>("");

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

  const handleinputLPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      setinputLP(numericValue);
    } else {
      setinputLP(null);
    }
  };

  useEffect(() => {
    setLockedLiquidity(
      (Number(liquiditys[0]?.locked) / 10 ** 6).toFixed(6).toLocaleString()
    );
  }, [liquiditys]);

  const onClickRemoveLiquidity = async () => {
    if (!clearingHouseContract || inputLP == null) return;

    try {
      setRemoveLiquidityLoading(true);
      const totalSupply = await pairContracts?.BTC?.totalSupply();
      const [reserve0, reserve1] = await pairContracts?.BTC?.getReserves();
      const token0 = await pairContracts?.BTC?.token0();
      const isBase = token0 === virtualTokenContracts?.BTC?.target;

      const [quoteMinimum, baseMinimum] = isBase
        ? [
            (reserve1 *
              BigInt(inputLP) *
              (1000n - BigInt(slippageTolerance * 10))) /
              (totalSupply * 1000n),
            (reserve0 *
              BigInt(inputLP) *
              (1000n - BigInt(slippageTolerance * 10))) /
              (totalSupply * 1000n),
          ]
        : [
            (reserve0 *
              BigInt(inputLP) *
              (1000n - BigInt(slippageTolerance * 10))) /
              (totalSupply * 1000n),
            (reserve1 *
              BigInt(inputLP) *
              (1000n - BigInt(slippageTolerance * 10))) /
              (totalSupply * 1000n),
          ];

      const dl = Math.floor(Date.now() / 1000) + deadline * 60;
      console.log(
        virtualTokenContracts.BTC.target,
        BigInt(inputLP),
        quoteMinimum,
        baseMinimum,
        dl
      );

      const gasLimit = 500000n;
      clearingHouseContract
        .removeLiquidity(
          virtualTokenContracts.BTC.target,
          BigInt(inputLP),
          quoteMinimum,
          baseMinimum,
          dl,
          { gasLimit }
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() => {
            notify("Transaction confirmed successfully !", true);
            onClose();
            setRemoveLiquidityLoading(false);
          });
        })
        .catch((error) => {
          notify(error.shortMessage, false);
          setRemoveLiquidityLoading(false);
        });

      // console.log("Liquidity removed successfully");
    } catch (error) {
      console.error("Error removing liquidity: ", error);
    }
  };

  useEffect(() => {
    setInputLPValue(
      ((Number(lockedLiquidity) * Number(inputLP)) / Number(userLP))
        .toFixed(6)
        .toString()
    );
  }, [inputLP, userLP, lockedLiquidity]);

  useEffect(() => {
    // console.log(userLP);
    if (Number(inputLP) > 0 && Number(inputLP) <= Number(userLP)) {
      setCanRemoveLiquidity(true);
    } else {
      setCanRemoveLiquidity(false);
    }
  }, [inputLP, userLP]);

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
            <div className="content-center">Remove liquidity</div>
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
                    <div className="flex gap-2 h-9 content-center font-normal mb-4">
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
                    <div className="text-[#F8FAFC] font-semibold mb-2">
                      Deadline&nbsp;
                      <span className="font-normal text-xs">(Minutes)</span>
                    </div>
                    <div className="flex gap-2 h-9 content-center font-normal">
                      <button
                        className={`px-3 rounded-xl border ${
                          deadline === 10
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setDeadline(10)}
                      >
                        10M
                      </button>
                      <button
                        className={`px-3 rounded-xl border ${
                          deadline === 20
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setDeadline(20)}
                      >
                        20M
                      </button>
                      <button
                        className={`px-3 rounded-xl border ${
                          deadline === 30
                            ? "text-blue-400 border-blue-700 hover:border-blue-600"
                            : "text-gray-400 border-gray-500 hover:text-gray-200"
                        }`}
                        onClick={() => setDeadline(30)}
                      >
                        30M
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
                    src={logo_LP}
                    alt="logo_LP"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                </div>
                <span className="content-center">LP</span>
              </div>
              <input
                type="number"
                value={inputLP ? inputLP : ""}
                onChange={handleinputLPChange}
                className="text-xl text-right h-10 bg-[#1E293B] focus:outline-none"
                placeholder="0.0"
              />
            </div>
            <div className="flex justify-between p-1 pt-2 text-sm text-[#94A3B8]">
              <div>Balance: {userLP}</div>
              {inputLPValue && <div>${Number(inputLPValue).toFixed(6)}</div>}
            </div>
            {Number(userLP) < Number(inputLP) && (
              <div className="text-sm text-red-500 font-semibold px-1">
                Exceeds wallet balance
              </div>
            )}
          </div>
          <div>
            <table className="w-full border border-[#0F172A] rounded-xl">
              <tbody>
                <tr className="font-bold h-11 bg-[#1E293B]">
                  <td className="w-32 p-2 content-center border border-[#0F172A]">
                    Total
                  </td>
                  <td className="p-2 content-center border border-[#0F172A]">
                    {inputLPValue
                      ? "$" + Number(inputLPValue).toFixed(6)
                      : "$0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className={`gap-4 w-full h-12 text-center font-bold content-center mt-4 rounded-lg ${
              canRemoveLiquidity
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
                : "bg-gray-700 text-[#94A3B8] cursor-not-allowed"
            } ${removeLiquidityLoading && "animate-pulse cursor-not-allowed"}`}
            onClick={onClickRemoveLiquidity}
            // disabled={addLiquidityLoading}
          >
            {removeLiquidityLoading ? "Loading..." : "Remove Liquidity"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidityModal;
