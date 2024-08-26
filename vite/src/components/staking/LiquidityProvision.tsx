import { FC } from "react";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";

const LiquidityProvision: FC = () => {
  return (
    <div>
      <div className="text-2xl font-bold mb-3">Liquidity provision</div>
      <div className="w-fit text-[#60A5FA] font-bold border-b-2 border-b-[#60A5FA] py-3 mb-6">
        All liquidity provision&nbsp;
      </div>

      <table className="table-auto w-full my-10 bg-[#162031] text-[#F8FAFC] rounded-xl overflow-hidden">
        <thead className="border-b-2 border-b-[#0F172A]">
          <tr>
            <th className="p-6 text-left">Action</th>
            <th className="p-6 text-right">Value</th>
            <th className="p-6 text-left">Tokens</th>
            <th className="p-6 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-[#1e293b] h-[70px]">
            <td>
              <div className="flex px-6 py-2 content-center">
                <div className="content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-minus w-4 mr-3 text-red-500"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                Withdraw
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">$73.78</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex h-full">
                <div className="flex content-center gap-2 px-2 py-1 m-1 bg-[#334155] rounded-lg">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">0.0044</div>
                </div>
                <div className="flex content-center gap-2 px-2 py-1 m-1  bg-[#334155] rounded-lg">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">0.5725</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">
                1 day ago
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-arrow-up-right text-[#94A3B8] hover:text-blue-500 ml-1"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
          <tr className="hover:bg-[#1e293b] h-[70px]">
            <td>
              <div className="flex px-6 py-2 content-center">
                <div className="content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-minus w-4 mr-3 text-green-500"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                Add tokens
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">$5.50k</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex h-full">
                <div className="flex content-center gap-2 px-2 py-1 m-1 bg-[#334155] rounded-lg">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">0.1</div>
                </div>
                <div className="flex content-center gap-2 px-2 py-1 m-1  bg-[#334155] rounded-lg">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 rounded-full"
                  />
                  <div className="w-auto content-center">50.3569</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex content-center justify-end">
                about 4 hours ago
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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

export default LiquidityProvision;
