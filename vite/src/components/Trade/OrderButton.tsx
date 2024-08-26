import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setSigner } from "../../features/providers/providersSlice";
import { switchNetwork } from "../../features/events/eventsSlice";
import { getSlippageAdjustedAmount, notify } from "../../lib";
import { parseUnits } from "ethers";
import { Contract } from "ethers";

interface OrderButtonParams {
  quoteValue: string;
  baseValue: string;
  leverageValue: number;
  isLong: boolean;
  isMarket: boolean;
  isExactInput: boolean;
}

const OrderButton: FC<OrderButtonParams> = ({
  quoteValue,
  baseValue,
  leverageValue,

  isLong,
  isMarket,
  isExactInput,
}) => {
  const { provider, signer, chainId } = useSelector(
    (state: RootState) => state.providers
  );
  const { clearingHouseContract, virtualTokenContracts, routerContract } =
    useSelector((state: RootState) => state.contracts);

  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onClickConnectWallet = () => {
    provider?.getSigner().then((signer) => dispatch(setSigner(signer)));
    dispatch(switchNetwork(11155111));
  };

  const onClickOpenPosition = async () => {
    if (!quoteValue || !baseValue) return;

    if (isLong) {
      const path = [
        virtualTokenContracts?.USDT?.target,
        virtualTokenContracts?.BTC?.target,
      ];

      const margin = parseUnits(quoteValue, 18) / 10n ** 12n;
      let amountIn = margin * BigInt(leverageValue);
      let amountOut = parseUnits(baseValue, 18) / 10n ** 10n;

      const slippageAdjustedAmount = await getSlippageAdjustedAmount(
        routerContract as Contract,
        amountIn,
        amountOut,
        path as string[],
        isExactInput,
        slippage
      );

      if (isExactInput) {
        amountOut = slippageAdjustedAmount;
      } else {
        amountIn = slippageAdjustedAmount;
      }

      // function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
      clearingHouseContract
        ?.openPosition(
          virtualTokenContracts?.BTC?.target,
          isExactInput,
          isLong,
          margin,
          amountIn,
          amountOut,
          Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() =>
            notify("Transaction confirmed successfully !", true)
          );
        })
        .catch((error) => notify(error.shortMessage, false));
    } else {
      const path = [
        virtualTokenContracts?.BTC?.target,
        virtualTokenContracts?.USDT?.target,
      ];

      const margin = parseUnits(quoteValue, 18) / 10n ** 12n;
      let amountIn = parseUnits(baseValue, 18) / 10n ** 10n;
      let amountOut = margin * BigInt(leverageValue);

      const slippageAdjustedAmount = await getSlippageAdjustedAmount(
        routerContract as Contract,
        amountIn,
        amountOut,
        path as string[],
        !isExactInput,
        slippage
      );

      if (isExactInput) {
        amountIn = slippageAdjustedAmount;
      } else {
        amountOut = slippageAdjustedAmount;
      }

      clearingHouseContract
        ?.openPosition(
          virtualTokenContracts?.BTC?.target,
          !isExactInput,
          isLong,
          margin,
          amountIn,
          amountOut,
          Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() =>
            notify("Transaction confirmed successfully !", true)
          );
        })
        .catch((error) => notify(error.shortMessage, false));
    }
  };
  return (
    <>
      {signer ? (
        <button
          className={`flex justify-center items-center rounded-[4px]  w-full  h-12 text-white mt-4 ${
            isLong ? "bg-[#1db1a8]" : "bg-[#ef3e9e]"
          }`}
          onClick={onClickOpenPosition}
          disabled={!quoteValue || !baseValue}
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
