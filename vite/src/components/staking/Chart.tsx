import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactEcharts from "echarts-for-react";

// 날짜와 데이터 설정
const generateData = () => {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2024-08-18");
  const dateArray: string[] = [];
  const volumeData: number[] = [];
  const tvlData: number[] = [];
  const feesData: number[] = [];

  // 예시 데이터
  const exampleData = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 1500,
    2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700,
    4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100,
    7300, 7500, 7700, 7900, 8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700,
    2500, 3000, 3200, 2800, 2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 3700,
    4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 2700,
    2900, 3100, 3500, 3700, 4000, 4200, 4500, 4700, 4900, 5100, 5300, 5500,
    5700, 5900, 6100, 6300, 6500, 6700, 6900, 7100, 7300, 7500, 7700, 7900,
    8100, 8300, 8500, 1500, 2000, 1800, 2200, 1700, 2500, 3000, 3200, 2800,
    2400, 2200, 2300, 2700, 2900, 3100, 3500, 3700, 4000, 4200, 4500,
  ];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dateString = currentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    dateArray.push(dateString);
    volumeData.push(exampleData.shift() || 0);
    tvlData.push(exampleData.shift() || 0);
    feesData.push(exampleData.shift() || 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { dateArray, volumeData, tvlData, feesData };
};

const Chart: FC = () => {
  const { dateArray, volumeData, tvlData, feesData } = generateData();
  const [timePeriod, setTimePeriod] = useState<
    "90 days" | "180 days" | "365 days" | "All time"
  >("90 days");
  const [isTimePeriodOpen, setIsTimePeriodOpen] = useState(false);
  const [graphTab, setGraphTab] = useState<"Volume" | "TVL" | "Fees">("Volume");
  const [graphData, setGraphData] = useState<{ x: string; y: number } | null>({
    x: "90 days volume",
    y: 6158,
  });

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    let endIndex = dateArray.length;
    switch (timePeriod) {
      case "90 days":
        endIndex = 90;
        break;
      case "180 days":
        endIndex = 180;
        break;
      case "365 days":
        endIndex = 365;
        break;
      case "All time":
      default:
        endIndex = dateArray.length;
    }

    return {
      date: dateArray.slice(dateArray.length - endIndex, dateArray.length),
      data:
        graphTab === "Volume"
          ? volumeData.slice(dateArray.length - endIndex, dateArray.length)
          : graphTab === "TVL"
          ? tvlData.slice(dateArray.length - endIndex, dateArray.length)
          : feesData.slice(dateArray.length - endIndex, dateArray.length),
    };
  }, [graphTab, timePeriod, dateArray, volumeData, tvlData, feesData]);

  const divTimePeriodRef = useRef<HTMLDivElement>(null);

  // div 바깥을 클릭했을 때 호출되는 함수
  const handleClickOutside = (event: MouseEvent) => {
    if (
      divTimePeriodRef.current &&
      !divTimePeriodRef.current.contains(event.target as Node)
    ) {
      setIsTimePeriodOpen(false);
    }
  };

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "category",
        data: filteredData.date,
        axisLabel: {
          color: "#94A3B8",
          formatter: (value: string) => {
            const date = new Date(value);
            const month = date.toLocaleDateString("en-GB", { month: "short" });
            const currentIndex = filteredData.date.indexOf(value);
            const previousDate =
              currentIndex > 0
                ? new Date(filteredData.date[currentIndex - 1])
                : null;
            const previousMonth = previousDate
              ? previousDate.toLocaleDateString("en-GB", { month: "short" })
              : "";

            return month;
          },
        },
        axisLine: {
          lineStyle: {
            color: "#4b5563",
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#94A3B8",
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
        },
        axisLine: {
          lineStyle: {
            color: "#4b5563",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#374151",
          },
        },
      },
      series: [
        {
          name: graphTab,
          type: graphTab === "TVL" ? "line" : "bar",
          data: filteredData.data,
          itemStyle: {
            color:
              graphTab === "Volume"
                ? "#B0E371"
                : graphTab === "TVL"
                ? "#F68BE9"
                : "#FFFC7D",
            borderRadius: 10,
            emphasis: {
              color: "#ED3AF5",
            },
          },
          barWidth: "60%",
          symbolSize: 4, // 포인트의 크기 설정
          symbolBorderWidth: 0, // 포인트의 테두리 두께 설정 (0으로 설정하여 테두리 없음)
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
    }),
    [dateArray, graphTab, filteredData]
  );

  const onEvents = useMemo(
    () => ({
      mouseover: (params: any) => {
        const xValue = params.name;
        const yValue = params.value;
        setGraphData({ x: xValue, y: yValue });
      },
    }),
    [setGraphData]
  );

  const timePeriodAccordion = () => {
    setIsTimePeriodOpen(!isTimePeriodOpen);
  };

  return (
    <div className="bg-[#162031] rounded-xl">
      <div className="m-5">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <div className="flex items-center gap-5 h-[50px] font-semibold text-[#94A3B8] border-b border-b-[#94A3B8] mr-6">
              <div
                className={`h-full content-center ${
                  graphTab === "Volume"
                    ? "text-[#AB71E2] border-b-2 border-b-[#AB71E2]"
                    : "hover:text-[#FFFC7D]"
                }`}
                onClick={() => setGraphTab("Volume")}
              >
                Volume
              </div>
              <div
                className={`h-full content-center ${
                  graphTab === "TVL"
                    ? "text-[#AB71E2] border-b-2 border-b-[#AB71E2]"
                    : "hover:text-[#FFFC7D]"
                }`}
                onClick={() => setGraphTab("TVL")}
              >
                TVL
              </div>
              <div
                className={`h-full content-center ${
                  graphTab === "Fees"
                    ? "text-[#AB71E2] border-b-2 border-b-[#AB71E2]"
                    : "hover:text-[#FFFC7D]"
                }`}
                onClick={() => setGraphTab("Fees")}
              >
                Fees
              </div>
            </div>
            <div className="relative" ref={divTimePeriodRef}>
              <div
                className="flex justify-between px-2 h-10 w-32 bg-[#1E293B] rounded-xl group"
                onClick={timePeriodAccordion}
              >
                <div className="content-center text-xs text-[#F8FAFC] font-semibold">
                  {timePeriod}
                </div>
                <div className="content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className={`feather feather-chevron-down text-blue-500 group-hover:text-[#F21BF6] ${
                      isTimePeriodOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              {isTimePeriodOpen && (
                <div className="absolute top-10 right-0 mt-3 z-10 w-44 bg-[#162031] text-[#F8FAFC]">
                  <div className="px-3 py-2 bg-[rgb(30,41,59)] text-[#64748B] border-b-2 border-b-[#0F172A] rounded-t-xl">
                    Time period:
                  </div>
                  <div
                    className="flex justify-between p-3 bg-[#1E293B] hover:bg-[#162031]"
                    onClick={() => {
                      setTimePeriod("90 days"),
                        setIsTimePeriodOpen(!isTimePeriodOpen);
                    }}
                  >
                    90 days
                    {timePeriod === "90 days" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-check text-blue-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex justify-between p-3 bg-[#1E293B] hover:bg-[#162031]"
                    onClick={() => {
                      setTimePeriod("180 days"),
                        setIsTimePeriodOpen(!isTimePeriodOpen);
                    }}
                  >
                    180 days
                    {timePeriod === "180 days" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-check text-blue-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex justify-between p-3 bg-[#1E293B] hover:bg-[#162031]"
                    onClick={() => {
                      setTimePeriod("365 days"),
                        setIsTimePeriodOpen(!isTimePeriodOpen);
                    }}
                  >
                    365 days
                    {timePeriod === "365 days" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-check text-blue-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex justify-between p-3 bg-[#1E293B] hover:bg-[#162031] rounded-b-xl"
                    onClick={() => {
                      setTimePeriod("All time"),
                        setIsTimePeriodOpen(!isTimePeriodOpen);
                    }}
                  >
                    All time
                    {timePeriod === "All time" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-check text-blue-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#F8FAFC] text-2xl font-bold">
              ${graphData?.y.toLocaleString("kor")}
            </div>
            <div className="text-[#94A3B8] text-sm">{graphData?.x}</div>
          </div>
        </div>
        <div>
          <ReactEcharts option={options} onEvents={onEvents} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
