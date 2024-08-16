import { FC } from "react";
import logo_USDT from "../../images/staking/logo_USDT.png";
import logo_WBTC from "../../images/staking/logo_WBTC.png";

const AddLiquidityModal: FC = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-[#162031] w-[435px] rounded-lg shadow-lg relative z-10">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="w-full p-4 pb-0">
          <div className="text-[#94A3B8] text-xs">Sepolia</div>
          <div className="flex justify-between content-center h-11 font-bold text-xl">
            <div className="content-center">Add liquidity</div>
            <div>
              <div className="w-9">
                <button className="w-9 h-9 bg-gray-800 rounded-full transform transition-all duration-300 hover:rotate-[-30deg] hover:text-blue-500 group">
                  <div className="flex content-center justify-center">
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
                      className="feather feather-settings group-hover:scale-125"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-[#1E293B] rounded-xl p-2 mb-4">
            <div className="flex justify-between p-1 h-12">
              <div className="flex content-center mr-2 px-4 rounded-xl bg-[#334155]">
                <div className="content-center">
                  <img
                    src={logo_WBTC}
                    alt="logo_WBTC"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                </div>
                <span className="content-center">BTC</span>
              </div>
              <input
                type="number"
                step="any"
                className="text-xl text-right h-10 bg-[#1E293B] focus:outline-none"
                placeholder="0.0"
              />
            </div>
            <div className="p-1 pt-2 text-[#94A3B8] ">Balance: 0</div>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-2 mb-4">
            <div className="flex justify-between p-1 h-12">
              <div className="flex content-center mr-2 px-4 rounded-xl bg-[#334155]">
                <div className="content-center">
                  <img
                    src={logo_USDT}
                    alt="logo_USDT"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                </div>
                <span className="content-center">USDT</span>
              </div>
              <input
                type="number"
                step="any"
                className="text-xl text-right h-10 bg-[#1E293B] focus:outline-none"
                placeholder="0.0"
              />
            </div>
            <div className="p-1 pt-2 text-[#94A3B8] ">Balance: 0</div>
          </div>
          <div>
            <table className="w-full border border-[#0F172A] rounded-xl overflow-hidden">
              <tr className="font-bold h-11 bg-[#1E293B]">
                <td className="w-32 p-2 content-center border border-[#0F172A]">
                  Total
                </td>
                <td className="p-2 content-center border border-[#0F172A]">
                  $0.00
                </td>
              </tr>
              <tr className="h-9 bg-[#162031]">
                <td className="p-2 border border-[#0F172A]">LP tokens</td>
                <td className="p-2 border border-[#0F172A]">0</td>
              </tr>
              <tr className="h-9 bg-[#1E293B]">
                <td className="p-2 border border-[#0F172A]">Price impact</td>
                <td className="p-2 border border-[#0F172A]">0.00%</td>
              </tr>
            </table>
          </div>
          <div className="w-full h-12 text-center content-center mt-4 rounded-lg bg-gray-700 text-[#94A3B8]">
            Preview
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;
