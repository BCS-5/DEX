import { FC, useEffect, useState } from "react";
import PoolComposition from "../components/staking/PoolComposition";
import PoolDetails from "../components/staking/PoolDetails";
import Chart from "../components/staking/Chart";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Contract } from "ethers";
import PoolInfo from "../components/staking/PoolInfo";
import PoolIntro from "../components/staking/PoolIntro";
import AddLiquidity from "../components/staking/AddLiquidity";

const Pool: FC = () => {
  const { pairContracts, accountBalanceContract, virtualTokenContracts } =
    useSelector((state: RootState) => state.contracts);
  const [btcBalance, setBtcBalance] = useState<string>("");
  const [btcValue, setBtcValue] = useState<string>("");
  const [usdtBalance, setUsdtBalance] = useState<string>("");
  const [usdtValue, setUsdtValue] = useState<string>("");
  const [totalPoolValue, setTotalPoolValue] = useState<string>("");
  const [markPrice, setMarkPrice] = useState<string>("");
  const [pairAddr, setPairAddr] = useState<string>("");
  const [pairName, setPairName] = useState<string>("");
  const [pairSymbol, setPairSymbol] = useState<string>("");

  useEffect(() => {
    const fetchgetReserves = async () => {
      try {
        const pair = "BTC";
        const contract: Contract = pairContracts[pair];

        if (contract) {
          const [reserve0, reserve1, ] =
            await contract.getReserves();
          setUsdtBalance((Number(reserve1) / 10 ** 6).toFixed(3).toString());
          setBtcBalance((Number(reserve0) / 10 ** 8).toFixed(3).toString());
          // console.log(
          //   `Reserve 0: ${(Number(reserve0) / 10 ** 6)
          //     .toFixed(3)
          //     .toString()
          //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
          // );
          // console.log(
          //   `Reserve 1: ${(Number(reserve1) / 10 ** 8)
          //     .toFixed(3)
          //     .toString()
          //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
          // );
          // console.log(`Block Timestamp Last: ${blockTimestampLast.toString()}`);
        } else {
          console.error(`Contract for ${pair} not found.`);
        }
      } catch (error) {
        console.error("Error fetching reserves:", error);
      }
    };

    const fetchgetDetail = async () => {
      try {
        const pair = "BTC";
        const contract: Contract = pairContracts[pair];

        if (contract) {
          setPairAddr(pairContracts[pair].target.toString());
          setPairName(await contract.name());
          setPairSymbol(await contract.symbol());
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchgetReserves();
    fetchgetDetail();
  }, [pairContracts]);

  useEffect(() => {
    const fetchMarkPrice = async () => {
      if (accountBalanceContract && virtualTokenContracts?.BTC?.target) {
        try {
          const mark = await accountBalanceContract.getMarkPrice(
            virtualTokenContracts.BTC.target
          );
          setMarkPrice((Number(mark) / 10 ** 16).toFixed(2).toString());
          // console.log("mark:  ", mark);
        } catch (error) {
          console.error("Error fetching Index price:", error);
        }
      } else {
        console.warn("virtualTokenContracts.BTC.target is null or undefined");
      }
    };

    fetchMarkPrice();
  }, [accountBalanceContract, virtualTokenContracts?.BTC?.target]);

  useEffect(() => {
    setBtcValue((Number(btcBalance) * Number(markPrice)).toFixed(2).toString());
    setUsdtValue(Number(usdtBalance).toFixed(2).toString());
  }, [btcBalance, usdtBalance, markPrice]);

  useEffect(() => {
    setTotalPoolValue((Number(btcValue) + Number(usdtValue)).toString());
  }, [btcValue, usdtValue]);

  return (
    <div className="min-h-screen bg-[#131722] text-[#F8FAFC] px-4 pt-8">
      <div className="grid grid-cols-3 gap-4">
        <PoolIntro pairAddr={pairAddr} />
        <div className="hidden"></div>
        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-y-8">
            <Chart />

            <PoolInfo totalPoolValue={totalPoolValue} />

            <PoolComposition
              btcBalance={btcBalance}
              btcValue={btcValue}
              usdtBalance={usdtBalance}
              usdtValue={usdtValue}
              btcTokenContractsAddress={virtualTokenContracts?.BTC?.target.toString()}
              usdtTokenContractsAddress={virtualTokenContracts?.USDT?.target.toString()}
            />
            <PoolDetails
              pairAddr={pairAddr}
              pairName={pairName}
              pairSymbol={pairSymbol}
            />
            <div>
              <div className="text-xl pb-2 font-bold">Pool management</div>
              <div className="text-base">
                The attributes of this pool are immutable, except for swap fees
                which can be edited via Governance.
              </div>
            </div>
          </div>
        </div>

        <AddLiquidity
          btcBalance={btcBalance}
          usdtBalance={usdtBalance}
          markPrice={markPrice}
          pairAddr={pairAddr}
        />
      </div>
    </div>
  );
};

export default Pool;
