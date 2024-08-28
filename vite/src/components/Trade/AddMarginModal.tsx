import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { formatUnits, parseUnits } from "ethers";
import { notify } from "../../lib";

interface AddMarginModalProps {
  isOpen: boolean;
  onClose: () => void;
  positionHash: string;
}

const AddMarginModal: FC<AddMarginModalProps> = ({
  isOpen,
  onClose,
  positionHash,
}) => {
  if (!isOpen) return null;

  const [value, setValue] = useState("");
  const [collateral, setCollateral] = useState<string>("0.0");

  const { clearingHouseContract, virtualTokenContracts, vaultContract } =
    useSelector((state: RootState) => state.contracts);

  const { signer } = useSelector((state: RootState) => state.providers);

  const handleChange = (e: any) => {
    // console.log(e);
    setValue(e.target.value);
  };

  const onClickAddMargin = () => {
    clearingHouseContract
      ?.addMargin(
        virtualTokenContracts?.BTC?.target,
        positionHash,
        parseUnits(value, 6)
      )
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
    vaultContract
      .getTotalCollateral(signer.address)
      .then((data) => setCollateral(Number(formatUnits(data, 6)).toFixed(2)));
  }, [vaultContract, signer]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-[#1E1F31] w-[320px] rounded-lg shadow-lg relative z-10">
        <div className="w-full p-4 pb-0">
          <div className="flex justify-between content-center h-11 font-bold text-xl text-[#f0f0f0]">
            <div className="content-center">Add Margin</div>
          </div>
        </div>
        <div className="bg-[#2C2D43] h-[100px] rounded-[4px] mx-4 p-4 mt-4 flex flex-col justify-between">
          <div className="flex w-fit self-end text-[12px] font-normal text-[#b2b4c6]">
            Available : {collateral} USDT
          </div>
          <div className="relative border-b-[2px] border-[#363A45] pb-2">
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(e)}
              className="w-full bg-transparent outline-none"
            ></input>
            <div className="absolute top-0 right-0">USDT</div>
          </div>
        </div>

        <div className="flex p-4 mt-4 gap-2 text-[#f0f0f0] text-[12px]">
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-[4px] mb-4 flex-1 text-center h-6"
            onClick={() => setValue((Number(collateral) * 0.25).toFixed(2))}
          >
            25%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-[4px] mb-4 flex-1 text-center h-6"
            onClick={() => setValue((Number(collateral) * 0.5).toFixed(2))}
          >
            50%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-[4px] mb-4 flex-1 text-center h-6"
            onClick={() => setValue((Number(collateral) * 0.75).toFixed(2))}
          >
            75%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-[4px] mb-4 flex-1 text-center h-6"
            onClick={() => setValue((Number(collateral) * 1).toFixed(2))}
          >
            100%
          </button>
        </div>
        <div className="flex p-4 pt-0 gap-4">
          <button
            className={`w-full h-10 text-center content-center rounded-[4px] text-[#f0f0f0] ${
              Number(value) > 0 && Number(value) <= Number(collateral)
                ? "bg-gradient-to-r from-[#e05fbb] to-[#4250f4] hover:bg-[#8388F5] hover:from-[#4250f4]"
                : "bg-[#2C2D43] cursor-not-allowed"
            } `}
            disabled={Number(value) == 0 || Number(value) > Number(collateral)}
            onClick={() => {
              onClickAddMargin();
              onClose();
            }}
          >
            {Number(value) <= Number(collateral)
              ? "Confirm"
              : "Insufficient balance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMarginModal;
