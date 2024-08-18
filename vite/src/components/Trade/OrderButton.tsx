import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setSigner } from "../../features/providers/providersSlice";
import { switchNetwork } from "../../features/events/eventsSlice";

interface OrderButtonParams {
  quoteValue: string;
  baseValue: string;
  leverageValue: number;
  isLong: boolean;
}

const OrderButton: FC<OrderButtonParams> = ({
  quoteValue,
  baseValue,
  leverageValue,
  isLong,
}) => {
  const { provider, signer, chainId } = useSelector(
    (state: RootState) => state.providers
  );
  const { clearingHouseContract } = useSelector(
    (state: RootState) => state.contracts
  );

  const dispatch = useDispatch();

  const onClickConnectWallet = () => {
    provider?.getSigner().then((signer) => dispatch(setSigner(signer)));
    dispatch(switchNetwork(11155111));
  };

  const onClickOpenPosition = () => {};
  return (
    <>
      {signer ? (
        <button
          className={`flex justify-center items-center rounded-[4px]  w-full  h-12 text-white mt-4 ${
            isLong ? "bg-[#1db1a8]" : "bg-[#ef3e9e]"
          }`}
          onClick={onClickConnectWallet}
        >
          {isLong ? "Open Long" : "Open Short"}
        </button>
      ) : (
        <button
          className="flex justify-center items-center rounded-[4px]  w-full  h-12 text-white mt-4"
          style={{ background: "linear-gradient(90deg, #e05fbb, #4250f4)" }}
          onClick={onClickConnectWallet}
        >
          Connect Wallet
        </button>
      )}
    </>
  );
};

export default OrderButton;
