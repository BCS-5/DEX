import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { formatUnits } from "ethers";
import { useNavigate } from "react-router-dom";
import { notify } from "../../lib";

const Deposit: FC = () => {
  const { vaultContract, faucetContract } = useSelector(
    (state: RootState) => state.contracts
  );
  const { blockNumber } = useSelector((state: RootState) => state.events);

  const { signer } = useSelector((state: RootState) => state.providers);
  const { positions, orders } = useSelector(
    (state: RootState) => state.history
  );

  const [used, setUsed] = useState<string>("0.00");
  const [available, setAvailable] = useState<string>("0.00");

  const navigate = useNavigate();

  const total = useMemo(() => {
    return (Number(used) + Number(available)).toFixed(2);
  }, [used, available]);

  const onClickFaucet = () => {
    faucetContract
      ?.claimTestnetTokens()
      .then((tx) => {
        notify("Pending Transaction ...", true);
        tx.wait().then(() =>
          notify("Transaction confirmed successfully !", true)
        );
      })
      .catch((error) => notify(error.shortMessage, false));
  };

  useEffect(() => {
    if (!vaultContract || !signer) return;

    vaultContract.getTotalCollateral(signer.address).then((data) => {
      orders.forEach((v) => (data -= v.margin));
      setAvailable(Number(formatUnits(data, 6)).toFixed(2));
    });
  }, [vaultContract, signer, blockNumber]);

  useEffect(() => {
    if (!positions.length) {
      setUsed("0.00");
      return;
    }
    const sumMargin = positions.reduce((accumulator, currentValue) => {
      return { margin: accumulator.margin + currentValue.margin } as Position;
    });

    setUsed(Number(formatUnits(sumMargin.margin, 6)).toFixed(2));
  }, [positions, blockNumber]);

  return (
    <div className="flex flex-col w-full  self-end bg-[#1E1F31] rounded-[4px]  p-4">
      <div className="flex justify-between w-full text-[14px] text-[#f0f0f0] font-semibold mb-2">
        <span>Assets</span>
      </div>
      <div className="flex justify-between w-full text-[12px] text-[#f0f0f0]/[0.6] font-semibold">
        <span>Total Collateral</span>
        <span>{total} USDT</span>
      </div>
      <div className="flex justify-between w-full text-[12px] text-[#f0f0f0]/[0.6] font-semibold">
        <span>Available Collateral</span>
        <span>{available} USDT</span>
      </div>

      <div className="flex gap-6 mt-4">
        <button
          className="w-full h-10 text-center content-center rounded-[4px] text-[#f0f0f0] bg-gradient-to-r from-[#e05fbb] to-[#4250f4] hover:bg-[#8388F5] hover:from-[#4250f4]"
          onClick={onClickFaucet}
        >
          Get USDT
        </button>
        <button
          className="w-full h-10 text-center content-center rounded-[4px] text-[#f0f0f0] bg-gradient-to-r from-[#e05fbb] to-[#4250f4] hover:bg-[#8388F5] hover:from-[#4250f4]"
          onClick={() => navigate("/Portfolio")}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default Deposit;
