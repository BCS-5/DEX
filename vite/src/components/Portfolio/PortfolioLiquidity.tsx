import React from "react";
import { useSelector } from "react-redux";
import { ethers, formatUnits } from "ethers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { contracts } from "../../contracts/addresses";

const PortfolioLiquidity: React.FC = () => {
  const liquidityPositions = useSelector(
    (state: RootState) => state.history.liquiditys
  );
  const { signer } = useSelector((state: RootState) => state.providers);
  const { pairContracts } = useSelector((state: RootState) => state.contracts);

  async (poolName: string, amount: bigint) => {
    if (!signer) return;
    try {
      const clearingHouseContract = new ethers.Contract(
        contracts.clearingHouse.address,
        contracts.clearingHouse.abi,
        signer
      );
      const tx = await clearingHouseContract.removeLiquidity(
        pairContracts[poolName].target,
        amount
      );
      await tx.wait();
      toast.success("유동성이 성공적으로 제거되었습니다.");
    } catch (error) {
      console.error("Error removing liquidity:", error);
      toast.error("유동성 제거 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-[#1E222D] rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#f0f0f0]">
          <thead className="text-xs uppercase bg-[#131722]">
            <tr className="text-[#72768f] text-xs">
              <th className="px-6 py-2">Pool</th>
              <th className="px-6 py-2">Amount</th>
              <th className="px-6 py-2">Value Locked</th>
              <th className="px-6 py-2">Fees Earned</th>
              <th className="px-6 py-2">unClaimed Fees</th>
            </tr>
          </thead>
          <tbody>
            {liquidityPositions?.[0]?.amount > 0 ? (
              liquidityPositions.map((position, index) => (
                <tr
                  key={index}
                  className="border-b border-[#2A2E39] hover:bg-[#1E222D]"
                >
                  <td className="px-6 py-4">{position.poolName}</td>
                  <td className="px-6 py-4">{position.amount.toString()}</td>
                  <td className="px-6 py-4">
                    {formatUnits(position.locked, 6)}
                  </td>
                  <td className="px-6 py-4">
                    {formatUnits(position.earndFees, 6)}
                  </td>
                  <td className="px-6 py-4">
                    {formatUnits(position.unClaimedFees, 6)}
                  </td>
                  <td className="px-6 py-4">
                    {/*                     
                    <button
                      onClick={() =>
                        removeLiquidity(position.poolName, position.amount)
                      }
                      className="bg-[#1DB1A8] text-white px-3 py-1 rounded text-xs hover:bg-[#2A2E3E]"
                    > */}
                    <button>
                      <Link
                        to="/pool/0x1234"
                        className="text-[#1DB1A8] text-xs"
                      >
                        Remove &gt;
                      </Link>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="text-[#72768f]">No Liquidity Positions</div>
                  <Link to="/Staking" className="text-[#1DB1A8] text-xs">
                    Add Liquidity &gt;
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioLiquidity;
/*
interface Liquidity {
  poolName: string;
  amount: bigint;
  locked: bigint;
  earndFees: bigint;
  unClaimedFees: bigint;
}*/
