import React, { useEffect, useState } from "react";
import { PoolData } from "../..";

const Test: React.FC = () => {
  const [poolData, setPoolData] = useState<PoolData | null>(null);

  useEffect(() => {
    fetch(
      "http://141.164.38.253:8090/api/history?symbol=BTC&resolution=1D&from=1716531147&to=1724307147"
    )
      .then((response) => response.json())
      .then((result) => setPoolData(result))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (!poolData || poolData.apr !== undefined) return;
    const apr = (poolData.fee * 365 * 100) / poolData.volume;
    setPoolData({ ...poolData, apr: Number(apr.toFixed(2)) });
  }, [poolData]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">Contract Name:</h1>
        <p className="text-lg text-gray-600">{poolData?.fee}</p>
        <p className="text-lg text-gray-600">{poolData?.volume}</p>
      </div>
    </div>
  );
};

export default Test;
