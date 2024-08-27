import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { RootState } from "../../app/store";
import { formatUnits } from "ethers";

const COLORS = ["#0088FE", "#00C49F"];

const PortfolioOverview: React.FC = () => {
  const { positions, liquiditys, history } = useSelector(
    (state: RootState) => state.history
  );

  const { signer } = useSelector((state: RootState) => state.providers);
  const {
    vaultContract,
    clearingHouseContract,
    virtualTokenContracts,
    accountBalanceContract,
    pairContracts,
    routerContract,
  } = useSelector((state: RootState) => state.contracts);

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

  const [usdValue, setUsdValue] = useState<bigint>(0n);
  const [baseValue, setbaseValue] = useState<bigint>(0n);

  const totalValue = useMemo(
    () => Number(formatUnits(usdValue + baseValue, 6)).toFixed(2),
    [usdValue, baseValue]
  );

  const getFundingPayment = async (_position: Position) => {
    const positionInfo = await clearingHouseContract?.getPosition(
      _position.trader,
      _position.baseToken,
      _position.positionHash
    );

    return await accountBalanceContract?.calculateFundingPayment(
      [...positionInfo],
      virtualTokenContracts?.BTC?.target,
      pairContracts?.BTC?.target
    );
  };

  const getUnrealizedPnl = async (_position: Position) => {
    let pnl = 0n;
    const fundingPayment = await getFundingPayment(_position);

    if (_position.isLong) {
      const path = [
        virtualTokenContracts?.BTC?.target,
        virtualTokenContracts?.USDT?.target,
      ];

      const amounts = await routerContract?.getAmountsOut(
        _position.positionSize,
        path
      );

      pnl =
        _position.margin +
        amounts[1] -
        BigInt(_position.openNotional) +
        fundingPayment;
    } else {
      const path = [
        virtualTokenContracts?.USDT?.target,
        virtualTokenContracts?.BTC?.target,
      ];

      const amounts = await routerContract?.getAmountsIn(
        _position.positionSize,
        path
      );

      pnl =
        _position.margin +
        BigInt(_position.openNotional) -
        amounts[0] +
        fundingPayment;
    }

    return pnl;
  };

  const getTotalValue = () => {
    vaultContract?.getTotalCollateral(signer?.address).then((collateral) => {
      let total = collateral;
      console.log(total);
      liquiditys.forEach((v) => {
        total += v.locked + v.unClaimedFees;
      });
      setUsdValue(total);
    });
  };

  const getBaseValue = () => {
    const asyncReqs = positions.map((v) => getUnrealizedPnl(v));
    Promise.all(asyncReqs).then((res) => {
      let base = 0n;
      res.forEach((v) => {
        base += v;
      });
      setbaseValue(base);
    });
  };

  useEffect(() => {
    if (
      !virtualTokenContracts?.BTC?.target ||
      !pairContracts?.BTC?.target ||
      !signer?.address ||
      !vaultContract
    )
      return;
    getTotalValue();
    getBaseValue();
  }, [positions, vaultContract, signer, virtualTokenContracts, pairContracts]);

  const portfolioComposition = useMemo<any[]>(() => {
    return [
      { name: "BTC", value: Number(formatUnits(baseValue, 6)) },
      {
        name: "Collateral",
        value: Number(formatUnits(usdValue, 6)),
      },
    ];
  }, [baseValue, usdValue]);

  const totalVolume = useMemo(() => {
    if (!history) return "0.00";
    let total = 0n;
    console.log(history);
    history.forEach((v) => {
      total += v.openNotional;
    });

    return Number(formatUnits(total, 6)).toFixed(2);
  }, [history]);

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
              Total Volume
            </h3>
            <p className="text-2xl font-bold text-[#f0f0f0]">${totalVolume}</p>
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
                    {portfolioComposition.map((_, index) => (
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
