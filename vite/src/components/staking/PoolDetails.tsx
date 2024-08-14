import { FC } from "react";

const PoolDetails: FC = () => {
  return (
    <div>
      <div className="text-2xl font-bold mb-5">Pool details</div>
      <table className="table-auto w-full my-10 bg-[#162031] border text-[#F8FAFC] rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-[#1E293B]">
            <th className="border border-[#334155] px-4 py-3 text-left">
              Attribute
            </th>
            <th className="border border-[#334155] px-4 py-3  text-left">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool name</td>
            <td className="border border-[#334155] px-4 py-3">20BTC-80USDT</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool symbol</td>
            <td className="border border-[#334155] px-4 py-3">20BTC-80USDT</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool type</td>
            <td className="border border-[#334155] px-4 py-3">Weighted</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Swap fees</td>
            <td className="border border-[#334155] px-4 py-3">
              0.5% (this may be edited via Governance)
            </td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool Manager</td>
            <td className="border border-[#334155] px-4 py-3">None</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool Owner</td>
            <td className="border border-[#334155] px-4 py-3">
              Delegate owner
            </td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">
              Contract address
            </td>
            <td className="border border-[#334155] px-4 py-3">
              0x8c34D61A48d5bD71C01b8f52a5ef68C1F14a3E26&nbsp;
              <a href="https://sepolia.etherscan.io/address/0x8c34D61A48d5bD71C01b8f52a5ef68C1F14a3E26">
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
                  className="feather feather-arrow-up-right inline hover:text-blue-500"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Creation date</td>
            <td className="border border-[#334155] px-4 py-3">
              10 August 2024
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PoolDetails;
