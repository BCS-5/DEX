import { FC } from "react";
import { useNavigate } from "react-router-dom";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";
import logo_WETH from "../../images/staking/logo_WETH.png";

const PoolTable: FC = () => {
  const navigate = useNavigate();

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
        <tr className="hover:bg-[#1e293b]" onClick={() => navigate("/pool")}>
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
                  80%
                </div>
              </div>
              <div className="flex content-center gap-2 px-3 bg-[#334155] text-lg rounded-lg">
                USDT
                <div className="w-auto content-center text-sm text-[#94A3B8]">
                  20%
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">$ 120385912</td>
          <td className="px-6 py-4">$ 2254939</td>
          <td className="px-6 py-4">1.86 %</td>
        </tr>
        <tr className="hover:bg-[#1e293b]">
          <td className="px-6 py-4">
            <div className="flex">
              <img
                src={logo_WETH}
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
                ETH
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
          <td className="px-6 py-4">$ 52339625</td>
          <td className="px-6 py-4">$ 932750</td>
          <td className="px-6 py-4">4.04 %</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PoolTable;
