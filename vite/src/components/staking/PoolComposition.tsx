import { FC } from "react";
import { useNavigate } from "react-router-dom";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";
import logo_WETH from "../../images/staking/logo_WETH.png";

const PoolComposition: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="text-2xl font-bold mb-3">Pool composition</div>
      <div className="w-fit text-[#60A5FA] font-bold border-b-2 border-b-[#60A5FA] py-3 mb-6">
        Total composition&nbsp;
      </div>
      <table className="table-auto w-full my-10 bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
        <thead className="border-b-2 border-b-[#0F172A]">
          <tr>
            <th className="p-6 text-left">Token</th>
            <th className="p-6 text-left">Weight</th>
            <th className="p-6 text-left">Balance</th>
            <th className="p-6 text-left">Value</th>
            <th className="p-6 text-left">Token %</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-[#1e293b]" onClick={() => navigate("/pool")}>
            <td className="px-6 py-4">
              <div className="flex">
                <img
                  src={logo_WBTC}
                  alt="logo_WBTC"
                  className="w-9 rounded-full"
                />
                BTC
              </div>
            </td>
            <td className="px-6 py-4">80.00%</td>
            <td className="px-6 py-4">989439</td>
            <td className="px-6 py-4">$96767105</td>
            <td className="px-6 py-4">79.90%</td>
          </tr>
          <tr className="hover:bg-[#1e293b]">
            <td className="px-6 py-4">
              <div className="flex">
                <img
                  src={logo_USDT}
                  alt="logo_USDT"
                  className="w-9 rounded-full"
                />
                USDT
              </div>
            </td>
            <td className="px-6 py-4">20.00%</td>
            <td className="px-6 py-4">7592.196</td>
            <td className="px-6 py-4">$24346350</td>
            <td className="px-6 py-4">20.10%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PoolComposition;
