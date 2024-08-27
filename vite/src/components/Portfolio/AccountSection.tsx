import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatUnits } from "ethers";
import { RootState } from "../../app/store";

const AccountSection: React.FC = () => {
  const [totalValue, setTotalValue] = useState<string>("0");
  const [freeCollateral, setFreeCollateral] = useState<string>("0");
  const { signer } = useSelector((state: RootState) => state.providers);
  const { vaultContract } = useSelector((state: RootState) => state.contracts);
  const { blockNumber } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!signer || !vaultContract) return;

      try {
        const address = await signer.getAddress();
        const totalCollateral = await vaultContract.getTotalCollateral(address);
        const useCollateral = await vaultContract.getUseCollateral(address);

        const totalValueBigInt = BigInt(totalCollateral);
        const useCollateralBigInt = BigInt(useCollateral);
        const freeCollateralBigInt = totalValueBigInt - useCollateralBigInt;

        setTotalValue(formatUnits(totalValueBigInt, 6));
        setFreeCollateral(formatUnits(freeCollateralBigInt, 6));
      } catch (error) {
        console.error("Error fetching account data:", error);
        setTotalValue("Error");
        setFreeCollateral("Error");
      }
    };

    fetchAccountData();
  }, [signer, vaultContract, blockNumber]);

  return (
    <div className="bg-[#131722] p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Account</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[#72768f]">Total Collareral:</span>
          <span className="text-[#f0f0f0] font-semibold">${totalValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#72768f]">Free Collateral:</span>
          <span className="text-[#f0f0f0] font-semibold">
            ${freeCollateral}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
