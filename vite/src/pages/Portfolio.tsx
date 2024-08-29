import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ethers, formatUnits, parseUnits } from "ethers";
import { toast } from "react-toastify";
import { RootState } from "../app/store";
import PortfolioOverview from "../components/Portfolio/PortfolioOverview";
import PortfolioPositions from "../components/Portfolio/PortfolioPositions";
import PortfolioOrders from "../components/Portfolio/PortfolioOrders";
import PortfolioLiquidity from "../components/Portfolio/PortfolioLiquidity";
import AccountSection from "../components/Portfolio/AccountSection";
import PortfolioHistory from "../components/Portfolio/PortfolioHistory";
import { contracts } from "../contracts/addresses";

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"portfolio" | "history">(
    "portfolio"
  );
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { vaultContract } = useSelector((state: RootState) => state.contracts);
  const { blockNumber } = useSelector((state: RootState) => state.events);

  const { orders } = useSelector((state: RootState) => state.history);
  const { provider, signer } = useSelector(
    (state: RootState) => state.providers
  );

  const [collateral, setCollateral] = useState<string>("0.0");

  // const fetchData = useCallback(async () => {
  //   dispatch(fetchMarketData());
  //   if (signer) {
  //     const address = await signer.getAddress();
  //     dispatch(fetchUserPositions(address));
  //     dispatch(fetchUserOrders(address));
  //     dispatch(fetchUserLiquidityPositions(address));
  //     dispatch(fetchTradeHistory(address));
  //   }
  // }, [dispatch, signer]);

  // useEffect(() => {
  //   fetchData();
  //   const intervalId = setInterval(fetchData, 30000);
  //   return () => clearInterval(intervalId);
  // }, [fetchData]);

  useEffect(() => {
    vaultContract?.getTotalCollateral(signer?.address).then((data) => {
      orders.forEach((v) => {
        data -= v.margin;
      });
      setCollateral(Number(formatUnits(data, 6)).toFixed(2));
    });
  }, [vaultContract, signer, blockNumber, orders]);

  const handleDeposit = async () => {
    if (!signer || !provider) {
      toast.error("Wallet not connected.");
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    setIsDepositing(true);
    try {
      const usdtContract = new ethers.Contract(
        contracts.usdt.address,
        contracts.usdt.abi,
        signer
      );
      const vaultContract = new ethers.Contract(
        contracts.vault.address,
        contracts.vault.abi,
        signer
      );
      const amount = ethers.parseUnits(depositAmount, 6);

      // 현재 allowance 확인
      const currentAllowance = await usdtContract.allowance(
        await signer.getAddress(),
        contracts.vault.address
      );

      if (currentAllowance < amount) {
        // 필요한 경우 먼저 allowance를 0으로 설정
        if (currentAllowance > 0n) {
          toast.info("Resetting allowance...");
          const resetTx = await usdtContract.approve(
            contracts.vault.address,
            0n,
            { gasLimit: 100000 }
          );
          await resetTx.wait();
        }

        toast.info("Approving USDT...");
        const approveTx = await usdtContract.approve(
          contracts.vault.address,
          amount,
          { gasLimit: 100000 }
        );
        await approveTx.wait();
      }

      toast.info("Depositing...");
      const depositTx = await vaultContract.deposit(amount, {
        gasLimit: 300000,
      });
      await depositTx.wait();

      toast.success("Deposit successful!");
      // fetchData();
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      toast.error(`Deposit failed: ${(error as Error).message}`);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!signer || !provider) {
      toast.error("Wallet not connected.");
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdraw amount.");
      return;
    }
    // console.log(
    //   parseUnits(withdrawAmount, 6),
    //   parseUnits(collateral, 6),
    //   parseUnits(withdrawAmount, 6) > parseUnits(collateral, 6)
    // );

    if (parseUnits(withdrawAmount, 6) > parseUnits(collateral, 6)) {
      toast.error("Insufficient Balance.");
      return;
    }

    setIsWithdrawing(true);
    try {
      const vaultContract = new ethers.Contract(
        contracts.vault.address,
        contracts.vault.abi,
        signer
      );
      const amount = ethers.parseUnits(withdrawAmount, 6);

      // console.log(
      //   "Attempting to withdraw:",
      //   ethers.formatUnits(amount, 6),
      //   "USDT"
      // );

      const userAddress = await signer.getAddress();
      const totalCollateral = await vaultContract.getTotalCollateral(
        userAddress
      );
      const useCollateral = await vaultContract.getUseCollateral(userAddress);
      const freeCollateral = totalCollateral - useCollateral;

      // console.log(
      //   "Total Collateral:",
      //   ethers.formatUnits(totalCollateral, 6),
      //   "USDT"
      // );
      // console.log(
      //   "Used Collateral:",
      //   ethers.formatUnits(useCollateral, 6),
      //   "USDT"
      // );
      // console.log(
      //   "Free Collateral:",
      //   ethers.formatUnits(freeCollateral, 6),
      //   "USDT"
      // );

      if (amount > freeCollateral) {
        throw new Error("Insufficient free collateral");
      }

      const usdtContract = new ethers.Contract(
        contracts.usdt.address,
        contracts.usdt.abi,
        provider
      );
      const vaultUsdtBalance = await usdtContract.balanceOf(
        contracts.vault.address
      );
      // console.log(
      //   "Vault USDT Balance:",
      //   ethers.formatUnits(vaultUsdtBalance, 6),
      //   "USDT"
      // );

      if (vaultUsdtBalance < amount) {
        throw new Error("Insufficient USDT balance in Vault");
      }

      toast.info("Withdrawing...");

      const gasLimit = 500000n; // 가스 한도 증가

      // 트랜잭션 추정
      // const estimatedGas = await vaultContract.withdraw.estimateGas(amount);
      // console.log("Estimated gas:", estimatedGas.toString());

      const withdrawTx = await vaultContract.withdraw(amount, { gasLimit });
      // console.log("Transaction sent:", withdrawTx.hash);

      const receipt = await withdrawTx.wait();
      // console.log("Transaction receipt:", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // Check if balance was actually updated
      const newTotalCollateral = await vaultContract.getTotalCollateral(
        userAddress
      );
      // console.log(
      //   "New Total Collateral:",
      //   ethers.formatUnits(newTotalCollateral, 6),
      //   "USDT"
      // );

      if (newTotalCollateral === totalCollateral) {
        throw new Error("Balance was not updated");
      }

      toast.success("Withdraw successful!");
      // fetchData();
      setWithdrawAmount("");
    } catch (error: unknown) {
      console.error("Withdraw failed:", error);
      if (error instanceof Error) {
        toast.error(`Withdraw failed: ${error.message}`);
      } else {
        toast.error("Withdraw failed: Unknown error");
      }
      // 추가 오류 정보 로깅
      if (error instanceof Error && "transaction" in error) {
        console.error("Transaction details:", (error as any).transaction);
      }
      if (error instanceof Error && "receipt" in error) {
        console.error("Transaction receipt:", (error as any).receipt);
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#131722] text-[#72768f]">
      <div className="flex-grow p-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8 text-[#f0f0f0]">Portfolio</h1>

          <div className="flex gap-6 mb-8">
            <div className="flex-grow bg-[#1E222D] p-4 rounded-lg">
              <PortfolioOverview />
            </div>
            <div className="w-[300px] flex flex-col gap-4 ">
              <div className="bg-[#1E222D] p-4 rounded-lg">
                <AccountSection />
              </div>
              <div className="bg-[#1E222D] p-4 rounded-lg">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">
                    Deposit
                  </h2>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="amount"
                    className="w-full p-2 bg-[#131722] text-[#f0f0f0] rounded"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={isDepositing}
                    className="mt-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded transition-colors disabled:bg-gray-500"
                  >
                    {isDepositing ? "Depositing..." : "Deposit"}
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">
                    Withdraw
                  </h2>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="amount"
                    className="w-full p-2 bg-[#131722] text-[#f0f0f0] rounded"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="mt-2 w-full text-white p-2 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-colors disabled:bg-gray-500"
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mb-6 border-b border-[#1E222D]">
            <button
              className={`mr-8 pb-3 text-lg font-medium ${
                activeTab === "portfolio"
                  ? "border-b-2 border-[#AB71E2] text-[#AB71E2] text-xl"
                  : "text-[#f0f0f0]"
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
            <button
              className={`pb-3 text-lg font-medium ${
                activeTab === "history"
                  ? "border-b-2 border-[#AB71E2] text-[#AB71E2] text-xl"
                  : "text-[#f0f0f0]"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>

          <div className="">
            {activeTab === "portfolio" ? (
              <>
                <h2 className="text-lg font-semibold text-[#f0f0f0] my-4">
                  Positions
                </h2>
                <div className="bg-[#1E222D] p-4 rounded-lg">
                  <PortfolioPositions />
                </div>
                <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4 mt-8">
                  Open Orders
                </h2>
                <div className="bg-[#1E222D] p-4 rounded-lg">
                  <PortfolioOrders />
                </div>
                <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4 mt-8">
                  Liquiditys
                </h2>
                <div className="bg-[#1E222D] p-4 rounded-lg">
                  <PortfolioLiquidity />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4 mt-8">
                  Trade History
                </h2>
                <div className="bg-[#1E222D] p-4 rounded-lg">
                  <PortfolioHistory />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
