import React, { useEffect, useState } from "react";

interface ApiResponse {
  id: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TimeVolume {
  time: number;
  volume: number;
}

const Test: React.FC = () => {
  const [timeVolumeData, setTimeVolumeData] = useState<TimeVolume[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const From = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;
        const To = Math.floor(Date.now() / 1000);

        const response = await fetch(
          `https://141.164.38.253:8090/api/history?symbol=BTC&resolution=1D&from=${From}&to=${To}`
        );
        const result: ApiResponse[] = await response.json();

        // time과 volume만 추출하여 새로운 배열 생성
        const filteredData = result.map((item) => ({
          time: item.time,
          volume: item.volume,
        }));

        setTimeVolumeData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1>Time and Volume Data</h1>
        <ul>
          {timeVolumeData.map((item, index) => (
            <li key={index}>
              Time: {item.time}, Volume: {item.volume}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Test;
