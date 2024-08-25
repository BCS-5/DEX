import { FC, useEffect, useState } from "react";
import { PoolData } from "../..";

interface PoolInfoProps {
  totalPoolValue: string;
}

const PoolInfo: FC<PoolInfoProps> = ({ totalPoolValue }) => {
  const [poolData, setPoolData] = useState<PoolData | null>(null);

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
  }, [poolData, totalPoolValue]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Pool value
        </div>
        <div className="text-xl text-[#F8FAFC]">${totalPoolValue}</div>
      </div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Volume (24h)
        </div>
        <div className="text-xl text-[#F8FAFC]">${poolData?.volume}</div>
      </div>
      <div className="hidden"></div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Fees (24h)
        </div>
        <div className="text-xl text-[#F8FAFC]">${poolData?.fee}</div>
      </div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">APR</div>
        <div className="text-xl text-[#F8FAFC]">{poolData?.apr}%</div>
      </div>
      <div className="col-span-2 my-10"></div>
    </div>
  );
};

export default PoolInfo;
