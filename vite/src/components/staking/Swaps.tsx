import { FC } from "react";
import { useNavigate } from "react-router-dom";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";
import logo_WETH from "../../images/staking/logo_WETH.png";

const Swaps: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="text-2xl font-bold mb-5">Swaps</div>

      <table className="table-auto w-full my-10 bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
        <thead className="border-b-2 border-b-[#0F172A]">
          <tr>
            <th className="p-6 text-left">Swapper</th>
            <th className="p-6 text-right">Value</th>
            <th className="p-6 text-left">Swap details</th>
            <th className="p-6 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-[#1e293b]">
            <td className="px-6 py-4">0xd1fa...0cb7</td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">$18.88k</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex h-full">
                <div className="flex content-center gap-2 px-2 py-1 m-1 bg-[#334155] rounded-lg">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">6.1247</div>
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
                    className="feather feather-arrow-right mx-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
                <div className="flex content-center gap-2 px-2 py-1 m-1  bg-[#334155] rounded-lg">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">178.9727</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">
                about 33 minutes ago
                <a
                  href="https://etherscan.io/tx/0x4eecbbaa0696d7d72940b57fff649e09fe1902d654adb96ee90c2d632fb0fd8a"
                  className="content-center"
                >
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
                    className="feather feather-arrow-up-right text-[#94A3B8] hover:text-blue-500 ml-1"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1e293b]">
            <td className="px-6 py-4">0xd1fa...0cb7</td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">$7.85k</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex h-full">
                <div className="flex content-center gap-2 px-2 py-1 m-1 bg-[#334155] rounded-lg">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">2.5449</div>
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
                    className="feather feather-arrow-right mx-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
                <div className="flex content-center gap-2 px-2 py-1 m-1  bg-[#334155] rounded-lg">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">74.4156</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">
                about 33 minutes ago
                <a
                  href="https://etherscan.io/tx/0x4eecbbaa0696d7d72940b57fff649e09fe1902d654adb96ee90c2d632fb0fd8a"
                  className="content-center"
                >
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
                    className="feather feather-arrow-up-right text-[#94A3B8] hover:text-blue-500 ml-1"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1e293b] h-[70px] border-t-2 border-t-[#0F172A]">
            <td colSpan={4} className="text-[#94A3B8] hover:text-yellow-500">
              <div className="flex justify-center content-center font-semibold">
                Load more
                <div className="content-center">
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
                    className="feather feather-chevron-down ml-2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Swaps;
