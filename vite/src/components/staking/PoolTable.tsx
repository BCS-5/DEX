import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Contract } from "ethers";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";

const PoolTable: FC = () => {
  const navigate = useNavigate();
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const { pairContracts, accountBalanceContract, virtualTokenContracts } =
    useSelector((state: RootState) => state.contracts);
  const [pairAddr, setPairAddr] = useState<string>("");
  const [btcBalance, setBtcBalance] = useState<string>("");
  const [btcValue, setBtcValue] = useState<string>("");
  const [usdtBalance, setUsdtBalance] = useState<string>("");
  const [usdtValue, setUsdtValue] = useState<string>("");
  const [totalPoolValue, setTotalPoolValue] = useState<string>("");
  const [markPrice, setMarkPrice] = useState<string>("");

  useEffect(() => {
    fetch("https://fix-dex.duckdns.org:8090/api/getRecentVolume")
      .then((response) => response.json())
      .then((result) => setPoolData(result))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (!poolData || poolData.apr !== undefined) return;

    const apr = (poolData.volume * 0.0003 * 365 * 100) / Number(totalPoolValue);

    setPoolData({ ...poolData, apr: Number(apr.toFixed(2)) });
  }, [poolData, totalPoolValue]);

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
          console.log("mark:  ", mark);
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
    <table className="table-auto my-10 bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
      <thead className="border-b-2 border-b-[#0F172A]">
        <tr>
          <th className="p-6 text-left">Pool</th>
          <th className="p-6 text-left">Composition</th>
          <th className="p-6 text-left">Pool value</th>
          <th className="p-6 text-left">Volume (24h)</th>
          <th className="p-6 text-left">APR</th>
        </tr>
      </thead>
      <tbody>
        <tr
          className="hover:bg-[#1e293b]"
          onClick={() => navigate(`/pool/${pairAddr}`)}
        >
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
          <td className="px-6 py-4">
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
            $ {Number(totalPoolValue).toLocaleString()}
          </td>
          <td className="px-6 py-4">$ {poolData?.volume.toLocaleString()}</td>
          <td className="px-6 py-4">
            {(
              (Number(poolData?.volume) * 0.0003 * 365 * 100) /
              Number(totalPoolValue)
            )
              .toFixed(2)
              .toLocaleString()}
            %
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PoolTable;
