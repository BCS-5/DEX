import { FC } from "react";
import Tooltip from "./Tooltip";

interface PoolDetailsProps {
  pairAddr: string;
  pairName: string;
  pairSymbol: string;
}

const PoolDetails: FC<PoolDetailsProps> = ({
  pairAddr,
  pairName,
  pairSymbol,
}) => {
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
            <td className="border border-[#334155] px-4 py-3">{pairName}</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool symbol</td>
            <td className="border border-[#334155] px-4 py-3">{pairSymbol}</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool type</td>
            <td className="border border-[#334155] px-4 py-3">Weighted</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Swap fees</td>
            <td className="border border-[#334155] px-4 py-3">
              0.03% (this may be edited via Governance)
            </td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool Manager</td>
            <td className="border border-[#334155] px-4 py-3">None</td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">Pool Owner</td>
            <td className="border border-[#334155] px-4 py-3">
              <div className="flex">
                Delegate owner
                <Tooltip text="Permissioned functions validated by the FutuRX Vault Authorizer.">
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
                    className="feather feather-info cursor-pointer ml-2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </Tooltip>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-[#334155] px-4 py-3">
              Contract address
            </td>
            <td className="border border-[#334155] px-4 py-3">
              {pairAddr}&nbsp;
              <a
                href={`https://sepolia.etherscan.io/address/${pairAddr}`}
                target="_blank"
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
              22 August 2024
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PoolDetails;
