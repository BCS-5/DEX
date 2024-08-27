import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { RootState, AppDispatch } from "../../app/store";
import {
  fetchPortfolioData,
  fetchTradeHistory,
} from "../../features/portfolio/portfolioSlice";

const COLORS = ["#0088FE", "#00C49F"];

const PortfolioOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { freeCollateral, tradeHistory, isLoading } = useSelector(
    (state: RootState) => state.portfolio
  );
  const { positions } = useSelector((state: RootState) => state.history);

  const { signer } = useSelector((state: RootState) => state.providers);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const getAddress = async () => {
      if (signer) {
        try {
          const addr = await signer.getAddress();
          setAddress(addr);
        } catch (error) {
          console.error("Failed to get address:", error);
          setAddress(null);
        }
      } else {
        setAddress(null);
      }
    };
    getAddress();
  }, [signer]);

  useEffect(() => {
    if (address) {
      dispatch(fetchPortfolioData(address));
      dispatch(fetchTradeHistory(address));
    }
  }, [dispatch, address]);
  //useMemo 대신 useState로 value값 저장 후 useEffect 사용.
  const [totalValue, setTotalValue] = useState<string>("0.0");

  useEffect(() => {
    console.log(positions);
    if (!positions.length) return;
    const _totalValue = positions.reduce((sum, position) => {
      console.log(sum);
      return (
        sum + parseFloat(position.margin) //+

        // parseFloat(position.pnl)
      );
    }, parseFloat(freeCollateral));
    console.log(_totalValue);
    setTotalValue((_totalValue / 10 ** 6).toFixed(2));
  }, [positions, freeCollateral]);

  //볼륨 보류
  const totalVolume = useMemo(() => {
    if (!tradeHistory.length) return 0;
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return tradeHistory
      .filter(
        (trade) => new Date(trade.timestamp).getTime() > twentyFourHoursAgo
      )
      .reduce((sum, trade) => sum + parseFloat(trade.amount), 0);
  }, [tradeHistory]);

  const btcPosition = useMemo(() => {
    return positions.find((position) => position.pair === "BTC-USD");
  }, [positions]);

  const btcValue = btcPosition
    ? parseFloat(btcPosition.positionSize) +
      parseFloat(btcPosition.margin) +
      parseFloat(btcPosition.pnl)
    : 0;

  const portfolioComposition = [
    { name: "BTC", value: btcValue },
    { name: "Collateral", value: parseFloat(freeCollateral) },
  ];

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!address) {
    return (
      <div className="text-white">
        Please connect your wallet to view portfolio.
      </div>
    );
  }

  return (
    <div className="bg-[#131722] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Overview</h2>
      <div className="flex">
        <div className="w-1/2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#72768f] mb-2">
              Total Value
            </h3>
            <p className="text-2xl font-bold text-[#f0f0f0]">${totalValue}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#72768f] mb-2">
              Total Volume (24h)
            </h3>
            <p className="text-2xl font-bold text-[#f0f0f0]">
              ${totalVolume.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-1/2">
          {portfolioComposition.some((item) => item.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={portfolioComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioComposition.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | string, name: string) => [
                      `$${Number(value).toFixed(2)}`,
                      name,
                    ]}
                    contentStyle={{ background: "#1E222D", border: "none" }}
                    itemStyle={{ color: "#f0f0f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4">
                {portfolioComposition.map((entry, index) => (
                  <div
                    key={`legend-${index}`}
                    className="flex items-center mr-4"
                  >
                    <div
                      className="w-3 h-3 mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs text-[#72768f]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-[#72768f]">
              No portfolio data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
