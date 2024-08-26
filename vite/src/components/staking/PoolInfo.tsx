import { FC, useEffect, useState } from "react";

interface PoolInfoProps {
  totalPoolValue: string;
}

const PoolInfo: FC<PoolInfoProps> = ({ totalPoolValue }) => {
  const [poolData, setPoolData] = useState<PoolData | null>(null);

  useEffect(() => {
    console.log("total pool value: ", totalPoolValue);
    if (!poolData || poolData.apr !== undefined) return;
    const apr = (poolData.volume * 0.0003 * 365 * 100) / Number(totalPoolValue);
    console.log(apr);
    setPoolData({ ...poolData, apr: Number(apr.toFixed(2)) });
  }, [poolData, totalPoolValue]);

  useEffect(() => {
    fetch("https://fix-dex.duckdns.org:8090/api/getRecentVolume")
      .then((response) => response.json())
      .then((result) => setPoolData(result))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Pool value
        </div>
        <div className="text-xl text-[#F8FAFC]">
          ${Number(totalPoolValue).toLocaleString()}
        </div>
      </div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Volume (24h)
        </div>
        <div className="text-xl text-[#F8FAFC]">
          ${Number(poolData?.volume).toLocaleString()}
        </div>
      </div>
      <div className="hidden"></div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">
          Fees (24h)
        </div>
        <div className="text-xl text-[#F8FAFC]">
          ${(Number(poolData?.volume) * 0.0003).toFixed(3).toLocaleString()}
        </div>
      </div>
      <div className="bg-[#162031] rounded-xl p-4">
        <div className="text-[14px] text-[#94A3B8] font-semibold pb-2">APR</div>
        <div className="text-xl text-[#F8FAFC]">
          {(
            (Number(poolData?.volume) * 0.0003 * 365 * 100) /
            Number(totalPoolValue)
          )
            .toFixed(2)
            .toLocaleString()}
          %
        </div>
      </div>
      <div className="col-span-2 my-10"></div>
    </div>
  );
};

export default PoolInfo;
