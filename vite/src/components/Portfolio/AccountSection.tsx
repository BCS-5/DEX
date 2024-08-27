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
  const { positions, orders } = useSelector(
    (state: RootState) => state.history
  );

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!signer || !vaultContract) return;

      try {
        const address = await signer.getAddress();
        let freeCollateral = await vaultContract.getTotalCollateral(address);
        let totalCollateral = freeCollateral;

        positions.forEach((v) => {
          totalCollateral += v.margin;
        });

        orders.forEach((v) => {
          freeCollateral -= v.margin;
        });

        setTotalValue(formatUnits(totalCollateral, 6));
        setFreeCollateral(formatUnits(freeCollateral, 6));
      } catch (error) {
        console.error("Error fetching account data:", error);
        setTotalValue("Error");
        setFreeCollateral("Error");
      }
    };

    fetchAccountData();
  }, [positions, orders, blockNumber]);

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
