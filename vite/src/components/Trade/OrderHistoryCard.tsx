import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { formatPrice, formatUTCDate, notify } from "../../lib";
import CloseModal from "./CloseModal";
import AddMarginModal from "./AddMarginModal";

interface OrderHistoryCardParams {
  type: number;
  position: Position | History | number;
}

const menuType = [0b10011110, 0b10101100, 0b01001101];

const OrderHistoryCard: FC<OrderHistoryCardParams> = ({ type, position }) => {
  const checkType = (bit: number) => {
    return (menuType[type] & (1 << bit)) != 0;
  };

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isAddMarginModalOpen, setIsAddMarginModalOpen] = useState(false);

  const openCloseModal = () => {
    setIsCloseModalOpen(true);
  };

  const closeCloseModal = () => {
    setIsCloseModalOpen(false);
  };

  const openAddMarginModal = () => {
    setIsAddMarginModalOpen(true);
  };

  const closeAddMarginModal = () => {
    setIsAddMarginModalOpen(false);
  };

  const {
    routerContract,
    virtualTokenContracts,
    accountBalanceContract,
    pairContracts,
    clearingHouseContract,
  } = useSelector((state: RootState) => state.contracts);
  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const { provider } = useSelector((state: RootState) => state.providers);

  const [pnl, setPnl] = useState<string>("0.0");
  const [pnlPercent, setPnlPercent] = useState<string>("0.0");
  const [leverage, setLeverage] = useState<string>("0.0");
  const [entryPrice, setEntryPrice] = useState<string>("0.0");
  const [liquidPrice, setLiquidPrice] = useState<string>("0.0");
  const [time, setTime] = useState<string>("");

  const { markPrice } = useSelector((state: RootState) => state.events);

  const getFundingPayment = async (_position: Position) => {
    const positionInfo = await clearingHouseContract?.getPosition(
      _position.trader,
      _position.baseToken,
      _position.positionHash
    );

    return await accountBalanceContract?.calculateFundingPayment(
      [...positionInfo],
      virtualTokenContracts?.BTC?.target,
      pairContracts?.BTC?.target
    );
  };

  const getUnrealizedPnl = async () => {
    const _position = position as Position;

    let pnl = 0n;
    const fundingPayment = await getFundingPayment(_position);

    if (_position.isLong) {
      const path = [
        virtualTokenContracts?.BTC?.target,
        virtualTokenContracts?.USDT?.target,
      ];

      const amounts = await routerContract?.getAmountsOut(
        _position.positionSize,
        path
      );

      pnl = amounts[1] - BigInt(_position.openNotional) + fundingPayment;
    } else {
      const path = [
        virtualTokenContracts?.USDT?.target,
        virtualTokenContracts?.BTC?.target,
      ];

      const amounts = await routerContract?.getAmountsIn(
        _position.positionSize,
        path
      );

      pnl = BigInt(_position.openNotional) - amounts[0] + fundingPayment;
    }
    setPnl((Number(pnl) / 10 ** 6).toFixed(2));
    setPnlPercent(((Number(pnl) / Number(_position.margin)) * 100).toFixed(2));
  };

  const getLeverageRatio = () => {
    const _position = position as Position;
    setLeverage(
      (Number(_position.openNotional) / Number(_position.margin)).toFixed(1)
    );
  };

  const getEntryPrice = () => {
    const _position = position as Position;

    setEntryPrice(
      formatPrice(
        (Number(_position.openNotional) * 100) / Number(_position.positionSize)
      )
    );
  };

  const getLiquidPrice = () => {
    const _position = position as Position;
    let liquidPrice = 0;
    if (_position.isLong) {
      liquidPrice =
        ((Number(_position.openNotional) - Number(_position.margin) * 0.9) *
          100) /
        Number(_position.positionSize);
    } else {
      liquidPrice =
        ((Number(_position.openNotional) + Number(_position.margin) * 0.9) *
          100) /
        Number(_position.positionSize);
    }

    if (liquidPrice < 0) liquidPrice = 0;
    setLiquidPrice(formatPrice(liquidPrice));
  };

  const getTime = () => {
    if (type != 2) return;

    const _history = position as History;

    provider?.getBlock(_history.blockNumber).then((block) => {
      if (!block) return;
      setTime(formatUTCDate(block.timestamp * 1000));
    });
  };

  const getFee = () => {
    if (type != 2) return 0.0;

    const _history = position as History;

    return Number((_history.openNotional * 3n) / 10000n) / 10 ** 6;
  };

  const onClickClose = async (closePercent: string) => {
    const _position = position as Position;
    // function closePosition (address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline)
    const closePositionSize =
      (BigInt(_position.positionSize) * BigInt(closePercent)) / 100n;
    let slippageAdjustedAmount = 0n;
    if (_position.isLong) {
      const path = [
        virtualTokenContracts?.BTC?.target,
        virtualTokenContracts?.USDT?.target,
      ];

      const amounts = await routerContract?.getAmountsOut(
        closePositionSize,
        path
      );

      slippageAdjustedAmount =
        amounts[1] -
        BigInt(Math.floor((Number(amounts[1]) * Number(slippage)) / 100));
    } else {
      const path = [
        virtualTokenContracts?.USDT?.target,
        virtualTokenContracts?.BTC?.target,
      ];

      const amounts = await routerContract?.getAmountsIn(
        closePositionSize,
        path
      );

      slippageAdjustedAmount =
        amounts[0] +
        BigInt(Math.floor((Number(amounts[0]) * Number(slippage)) / 100));
    }

    clearingHouseContract
      ?.closePosition(
        _position.baseToken,
        _position.positionHash,
        parseInt(closePercent),
        slippageAdjustedAmount,
        Math.floor(Date.now() / 1000) + Number(deadline) * 60
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
    getUnrealizedPnl();
    getLeverageRatio();
    getEntryPrice();
    getLiquidPrice();
    getTime();
  }, [position]);

  return (
    <>
      <div className={`h-[62px] px-6 flex hover:bg-[#1E1F31] cursor-pointer`}>
        <div className="flex text-[#f0f0f0] justify-between min-w-[906px] flex-grow flex-shrink-0 items-center">
          <div className="flex items-center w-[110px] flex-1 gap-2">
            <img
              src="https://api.synfutures.com/ipfs/icons/token/btc.png"
              className="w-5 h-5"
            />
            <div className="flex flex-col ">
              <div className="text-sm">BTCUSD</div>
              <div
                className={`text-xs ${
                  (position as Position).isLong
                    ? "text-[#2BBDB5]"
                    : "text-[#FF5AB5]"
                }`}
              >
                {(position as Position).isLong ? "Long" : "Short"} {leverage}x
              </div>
            </div>
          </div>
          {checkType(0) && (
            <div className="flex flex-col w-[120px] flex-1">
              <div className="text-sm text-[#f0f0f0]">
                {(position as History).type}
              </div>
              <div className="text-xs text-[#72768f]">Type</div>
            </div>
          )}
          {checkType(1) && (
            <div className="flex flex-col w-[120px] flex-1">
              <div
                className={`text-sm ${
                  Number(pnl) > 0 ? "text-[#2BBDB5]" : "text-[#FF5AB5]"
                }`}
              >
                {Number(pnl) > 0 && "+"}
                {pnl} USDT
              </div>
              <div className="text-xs text-[#72768f]">
                PNL
                <span
                  className={`${
                    Number(pnlPercent) > 0 ? "text-[#2BBDB5]" : "text-[#FF5AB5]"
                  }`}
                >
                  {Number(pnlPercent) > 0 && "+"} {pnlPercent}%
                </span>
              </div>
            </div>
          )}
          {checkType(2) && (
            <div className="flex flex-col w-[120px] flex-1">
              <div className="text-sm">
                {(Number((position as Position).margin) / 10 ** 6).toFixed(1)}{" "}
                USDT
              </div>
              <div className="flex items-center text-xs text-[#72768f] font-normal">
                <span> {type != 1 ? "Initial Margin" : "Collateral"}</span>
                {type === 0 && (
                  <button onClick={openAddMarginModal}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width="16px"
                      height="16px"
                      className="ml-1 mt-[1.5px]"
                    >
                      <path d="M12 6a1 1 0 00-1 1v4H7a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V7a1 1 0 00-1-1z"></path>
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10zm-2 0a8 8 0 10-16 0 8 8 0 0016 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          {checkType(3) && (
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">
                {(
                  Number((position as Position).openNotional) /
                  10 ** 6
                ).toFixed(1)}{" "}
              </div>
              <div className="text-xs text-[#72768f] font-normal">
                Size (USD)
              </div>
            </div>
          )}
          {checkType(4) && (
            <>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">{entryPrice}</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Entry Price
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">{markPrice}</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Mark Price
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">{liquidPrice}</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Liquid Price
                </div>
              </div>
            </>
          )}
          {checkType(5) && (
            <>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">58,496.6</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Open Price
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">58,396.2</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Trigger Price
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">55,862.6</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Mark Price
                </div>
              </div>
            </>
          )}
          {checkType(6) && (
            <>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">{entryPrice}</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Close Price
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm"> {getFee().toFixed(2)} USDT</div>
                <div className="text-xs text-[#72768f] font-normal">Fee</div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm">{time}</div>
                <div className="text-xs text-[#72768f] font-normal">
                  Time (UTC)
                </div>
              </div>
              <div className="flex flex-col w-[100px] flex-1">
                <div className="text-sm text-[#7e9aff]">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${
                      (position as History).transactionHash
                    }`}
                    target="_blank"
                  >
                    {/* {0xa9764bbf4}... */}
                    {(position as History).transactionHash.slice(0, 11)}...
                  </a>
                </div>
                <div className="text-xs text-[#72768f] font-normal">
                  Transaction Hash
                </div>
              </div>
            </>
          )}
        </div>
        {checkType(7) && (
          <div className="flex min-w-[147px] items-center justify-end flex-grow">
            <button
              className="w-[55px] h-[28px] rounded-[4px]  text-xs bg-[#2C2D43] py-[6px] px-3"
              onClick={openCloseModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
      <CloseModal
        isOpen={isCloseModalOpen}
        onClose={closeCloseModal}
        callback={onClickClose}
      />
      <AddMarginModal
        isOpen={isAddMarginModalOpen}
        onClose={closeAddMarginModal}
        positionHash={(position as Position).positionHash}
      />
    </>
  );
};

export default OrderHistoryCard;
