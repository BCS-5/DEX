import React, { useEffect, useRef, useState } from "react";
import { Datafeed } from "../../api/datafeed";
import CustomDatafeed from "../../api/CustomDatafeed";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface TradingViewChartParams {}

const TradingViewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [datafeed, setDatafeed] = useState(new Datafeed());
  const { blockNumber } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    datafeed.updateData();
  }, [blockNumber]);

  useEffect(() => {
    if (chartContainerRef.current) {
      const script = document.createElement("script");
      script.src = "/charting_library/charting_library.js"; // 라이브러리 경로
      script.async = true;

      script.onload = () => {
        // const datafeed = new Datafeed();

        const widget = new (window as any).TradingView.widget({
          container_id: chartContainerRef.current,
          library_path: "/charting_library/",
          // datafeed: new CustomDatafeed(),
          datafeed: datafeed,

          symbol: "BTC", // 심볼 값이 올바르게 설정되어 있는지 확인
          // timezone: "Asia/Seoul",
          timezone: "Asia/Seoul",
          theme: "Dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#131722",
          width: "100%",
          height: "100%",
          allow_symbol_change: false,
          symbol_search_enabled: false,
          time_frames: [],
          // enabled_features: ["header_widget", "header_resolutions"],
        });
      };

      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <div
        id="tradingview_chart"
        ref={chartContainerRef}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};

export default TradingViewChart;
