import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setSigner } from "../../features/providers/providersSlice";
import { switchNetwork } from "../../features/events/eventsSlice";
import { getSlippageAdjustedAmount, notify } from "../../lib";
import { parseUnits } from "ethers";
import { Contract } from "ethers";

interface OrderButtonParams {
  collateral: string;
  quoteValue: string;
  baseValue: string;
  leverageValue: number;
  isLong: boolean;
  isMarket: boolean;
  isExactInput: boolean;
}

const OrderButton: FC<OrderButtonParams> = ({
  collateral,
  quoteValue,
  baseValue,
  leverageValue,

  isLong,
  isMarket,
  isExactInput,
}) => {
  const { provider, signer } = useSelector(
    (state: RootState) => state.providers
  );
  const {
    clearingHouseContract,
    virtualTokenContracts,
    routerContract,
    orderContract,
  } = useSelector((state: RootState) => state.contracts);

  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onClickConnectWallet = () => {
    provider?.getSigner().then((signer) => dispatch(setSigner(signer)));
    dispatch(switchNetwork(11155111));
  };

  const onClickOpenOrder = async () => {
    if (!quoteValue || !baseValue) return;
    const margin = parseUnits(quoteValue, 18) / 10n ** 12n;
    const openNotional = margin * BigInt(leverageValue);
    const positionSize = parseUnits(baseValue, 18) / 10n ** 10n;

    if (margin < parseUnits("1", 6)) {
      notify("Please enter an amount of at least $1.", false);
      return;
    } else if (openNotional < parseUnits("50", 6)) {
      notify("Trade size including leverage must be at least $50.", false);
      return;
    }

    if (isLong) {
      orderContract
        ?.createOrder(
          virtualTokenContracts?.BTC?.target,
          margin,
          openNotional,
          positionSize,
          true
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() =>
            notify("Transaction confirmed successfully !", true)
          );
        });
    } else {
      orderContract
        ?.createOrder(
          virtualTokenContracts?.BTC?.target,
          margin,
          positionSize,
          openNotional,
          false
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() =>
            notify("Transaction confirmed successfully !", true)
          );
        });
    }
  };

  const onClickOpenPosition = async () => {
    if (!quoteValue || !baseValue) return;

    const margin = parseUnits(quoteValue, 18) / 10n ** 12n;

    let openNotional = margin * BigInt(leverageValue);
    let positionSize = parseUnits(baseValue, 18) / 10n ** 10n;

    if (margin < parseUnits("1", 6)) {
      notify("Please enter an amount of at least $1.", false);
      return;
    }

    if (isLong) {
      const path = [
        virtualTokenContracts?.USDT?.target,
        virtualTokenContracts?.BTC?.target,
      ];

      const slippageAdjustedAmount = await getSlippageAdjustedAmount(
        routerContract as Contract,
        openNotional,
        positionSize,
        path as string[],
        isExactInput,
        slippage
      );

      if (isExactInput) {
        positionSize = slippageAdjustedAmount;
      } else {
        openNotional = slippageAdjustedAmount;
      }

      // function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
      clearingHouseContract
        ?.openPosition(
          virtualTokenContracts?.BTC?.target,
          isExactInput,
          isLong,
          margin,
          openNotional,
          positionSize,
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

      let openNotional = margin * BigInt(leverageValue);
      let positionSize = parseUnits(baseValue, 18) / 10n ** 10n;

      const slippageAdjustedAmount = await getSlippageAdjustedAmount(
        routerContract as Contract,
        positionSize,
        openNotional,
        path as string[],
        !isExactInput,
        slippage
      );

      if (isExactInput) {
        positionSize = slippageAdjustedAmount;
      } else {
        openNotional = slippageAdjustedAmount;
      }

      clearingHouseContract
        ?.openPosition(
          virtualTokenContracts?.BTC?.target,
          !isExactInput,
          isLong,
          margin,
          positionSize,
          openNotional,
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
          className={`${
            !quoteValue || !baseValue || Number(quoteValue) > Number(collateral)
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } flex justify-center items-center rounded-[4px]  w-full  h-12 text-white mt-4 ${
            Number(quoteValue) > Number(collateral)
              ? "bg-[#242534]"
              : isLong
              ? "bg-[#1db1a8]"
              : "bg-[#ef3e9e]"
          } `}
          onClick={() =>
            isMarket ? onClickOpenPosition() : onClickOpenOrder()
          }
          disabled={
            !quoteValue || !baseValue || Number(quoteValue) > Number(collateral)
          }
        >
          {Number(quoteValue) > Number(collateral)
            ? "insufficient balance"
            : isMarket
            ? isLong
              ? "Open Long"
              : "Open Short"
            : isLong
            ? "Order Long"
            : "Order Short"}
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
