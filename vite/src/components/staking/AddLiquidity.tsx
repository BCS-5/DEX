import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import AddLiquidityModal from "./AddLiquidityModal";
import { JsonRpcSigner } from "ethers";
import { setSigner } from "../../features/providers/providersSlice";
import RemoveLiquidityModal from "./RemoveLiquidityModal";

interface AddLiquidityProps {
  btcBalance: string;
  usdtBalance: string;
  markPrice: string;
  pairAddr: string;
}

const AddLiquidity: FC<AddLiquidityProps> = ({
  btcBalance,
  usdtBalance,
  markPrice,
  pairAddr,
}) => {
  const { provider, signer } = useSelector(
    (state: RootState) => state.providers
  );
  const { vaultContract } = useSelector((state: RootState) => state.contracts);
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] =
    useState<boolean>(false);
  const [isRemoveLiquidityModalOpen, setIsRemoveLiquidityModalOpen] =
    useState<boolean>(false);
  const [poolRatio, setPoolRatio] = useState<string>("");
  const [userLP, setUserLP] = useState<string>("");
  const [LPValue, setLPValue] = useState<string>("");
  const [myPoolBalance, setMyPoolBalance] = useState<string>("");
  const dispatch = useDispatch();

  const openAddLiquidityModal = () => {
    setIsAddLiquidityModalOpen(true);
  };

  const openRemoveLiquidityModal = () => {
    setIsRemoveLiquidityModalOpen(true);
  };

  const closeModal = () => {
    setIsAddLiquidityModalOpen(false);
    setIsRemoveLiquidityModalOpen(false);
  };

  const onClickConnectWallet = () => {
    provider
      ?.getSigner()
      .then((signer: JsonRpcSigner) => dispatch(setSigner(signer)));
  };

  useEffect(() => {
    setPoolRatio((Number(btcBalance) / Number(usdtBalance)).toString());
  }, [btcBalance, usdtBalance]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!signer) return;
      if (vaultContract) {
        try {
          const myLP = await vaultContract.getUserLP(signer?.address, pairAddr);
          const LPValue = await vaultContract.getCumulativeTransactionFee(
            pairAddr
          );
          setUserLP(myLP);
          setLPValue((Number(LPValue) / 2 ** 128).toString());
          setMyPoolBalance(
            ((Number(myLP) * Number(LPValue)) / 2 ** 128).toFixed(2).toString()
          );
          console.log("user LP:  ", myLP);
          console.log("LP value:  ", Number(LPValue) / 2 ** 128);
        } catch (error) {
          console.error("Error fetching user LP:", error);
        }
      } else {
        console.warn("vaultContract.getUserLP is null or undefined");
      }
    };

    fetchUserBalance();
  }, [vaultContract, signer]);

  return (
    <div>
      {signer ? (
        <>
          <div className="flex justify-between bg-[#162031] font-bold p-4 rounded-t-xl">
            <div className="text-lg">My pool balance</div>
            <div className="text-2xl">${myPoolBalance}</div>
          </div>
          <div className="bg-[#1E293B] p-4 mb-8 rounded-b-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                onClick={openAddLiquidityModal}
              >
                Add liquidity
              </button>
              <button
                className={`h-12 rounded-lg font-bold ${
                  Number(myPoolBalance) > 0
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    : "text-gray-700 border border-gray-700 cursor-not-allowed"
                }`}
                onClick={openRemoveLiquidityModal}
              >
                Withdraw
              </button>
            </div>
            <div className="pt-4 text-[#94A3B8] text-xs">
              Liquidity Providers encounter risks when using DeFi and FutuRX
              pools.
            </div>
          </div>
          <AddLiquidityModal
            isOpen={isAddLiquidityModalOpen}
            onClose={closeModal}
            poolRatio={poolRatio}
            markPrice={markPrice}
            pairAddr={pairAddr}
          />
          <RemoveLiquidityModal
            isOpen={isRemoveLiquidityModalOpen}
            onClose={closeModal}
            userLP={userLP}
            LPValue={LPValue}
            pairAddr={pairAddr}
          />
        </>
      ) : (
        <>
          <div className="bg-[#162031] font-bold text-lg p-4 rounded-t-xl">
            My pool balance
          </div>
          <div className="bg-[#1E293B] p-4 rounded-b-xl">
            <button
              className="w-full h-12 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              onClick={onClickConnectWallet}
            >
              Connect wallet
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddLiquidity;
