import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Contract } from "ethers";
import { PoolData } from "../..";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";

const PoolTable: FC = () => {
  const navigate = useNavigate();
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const { pairContracts } = useSelector((state: RootState) => state.contracts);
  const [pairAddr, setPairAddr] = useState<string>("");

  useEffect(() => {
    fetch("http://141.164.38.253:8090/api/getLiquidityPool?token=BTC")
      .then((response) => response.json())
      .then((result) => setPoolData(result))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (!poolData || poolData.apr !== undefined) return;
    const apr = (poolData.fee * 365 * 100) / poolData.volume;
    setPoolData({ ...poolData, apr: Number(apr.toFixed(2)) });
  }, [poolData]);

  useEffect(() => {
    const pair = "BTC";
    const contract: Contract = pairContracts[pair];

    if (contract) {
      setPairAddr(pairContracts[pair].target.toString());
    }
  }, [pairContracts]);

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
          <td className="px-6 py-4">$ {poolData?.fee}</td>
          <td className="px-6 py-4">$ {poolData?.volume}</td>
          <td className="px-6 py-4">{poolData?.apr} %</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PoolTable;
