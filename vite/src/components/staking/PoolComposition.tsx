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
            <th className="p-6 text-right">Balance</th>
            <th className="p-6 text-right">Value</th>
            <th className="p-6 text-right">Token %</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-[#1e293b]" onClick={() => navigate("/pool")}>
            <td className="px-6 py-4">
              <div className="flex">
                <a
                  href="https://etherscan.io/address/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
                  className="flex hover:text-yellow-500 group"
                >
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-9 rounded-full mr-2"
                  />
                  <span className="content-center">BTC</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-arrow-up-right text-[#94A3B8] group-hover:text-yellow-500 h-full ml-1"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </td>
            <td className="px-6 py-4">80.00%</td>
            <td className="px-6 py-4 text-right">989439</td>
            <td className="px-6 py-4 text-right">$96767105</td>
            <td className="px-6 py-4 text-right">79.90%</td>
          </tr>
          <tr className="hover:bg-[#1e293b]">
            <td className="px-6 py-4">
              <div className="flex">
                <a
                  href="https://sepolia.etherscan.io/address/0x8c34D61A48d5bD71C01b8f52a5ef68C1F14a3E26"
                  className="flex hover:text-yellow-500 group"
                >
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-9 rounded-full mr-2"
                  />
                  <span className="content-center">USDT</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-arrow-up-right text-[#94A3B8] group-hover:text-yellow-500 h-full ml-1"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </td>
            <td className="px-6 py-4">20.00%</td>
            <td className="px-6 py-4 text-right">7592.196</td>
            <td className="px-6 py-4 text-right">$24346350</td>
            <td className="px-6 py-4 text-right">20.10%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PoolComposition;
