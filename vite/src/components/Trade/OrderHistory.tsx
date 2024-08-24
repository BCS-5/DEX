import { FC, useEffect, useState } from "react";
import OrderHistoryCard from "./OrderHistoryCard";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import EmptyData from "./EmptyData";
import ResizeHandler from "./ResizeHandler";

const cards = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [1, 2],
  [1, 2, 3, 4],
];

const OrderHistory: FC = () => {
  const { clearingHouseContract, virtualTokenContracts, routerContract } =
    useSelector((state: RootState) => state.contracts);

  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const { signer } = useSelector((state: RootState) => state.providers);
  const { blockNumber } = useSelector((state: RootState) => state.events);

  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Position[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [markPrice, setMarkPrice] = useState<string>("0.0");

  const onClickCloseAll = () => {
    const positionHashs = [] as string[];
    const baseTokens = [] as string[];
    const slippageAdjustedAmounts = [] as any[];

    const promises = [] as any[];
    positions.forEach((v, idx) => {
      positionHashs.push(v.positionHash);
      baseTokens.push(virtualTokenContracts?.BTC?.target as string);

      if (v.isLong) {
        const path = [
          virtualTokenContracts?.BTC?.target,
          virtualTokenContracts?.USDT?.target,
        ];

        promises.push(
          routerContract
            ?.getAmountsOut(v.positionSize, path)
            .then((amounts) => {
              slippageAdjustedAmounts[idx] =
                amounts[1] -
                BigInt(
                  Math.floor((Number(amounts[1]) * Number(slippage)) / 100)
                );
            })
        );
      } else {
        const path = [
          virtualTokenContracts?.USDT?.target,
          virtualTokenContracts?.BTC?.target,
        ];

        promises.push(
          routerContract?.getAmountsIn(v.positionSize, path).then((amounts) => {
            slippageAdjustedAmounts[idx] =
              amounts[0] +
              BigInt(Math.floor((Number(amounts[0]) * Number(slippage)) / 100));
          })
        );
      }
    });

    Promise.all(promises).then((data) => {
      // closePositionBatch (address[] memory baseTokens, bytes32[] memory positionHashs, uint[] memory slippageAdjustedAmounts, uint deadline)
      clearingHouseContract?.closePositionBatch(
        baseTokens,
        positionHashs,
        slippageAdjustedAmounts,
        Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
      );
    });
  };

  const getHistory = async () => {
    if (!clearingHouseContract) return;
    const updateEventFilter = clearingHouseContract.filters.UpdatePosition(
      signer?.address
    );
    const closeEventFilter = clearingHouseContract.filters.ClosePosition(
      signer?.address
    );

    const updateEvent = clearingHouseContract?.queryFilter(
      updateEventFilter,
      0,
      "latest"
    );
    const closeEvent = clearingHouseContract?.queryFilter(
      closeEventFilter,
      0,
      "latest"
    );

    Promise.all([updateEvent, closeEvent]).then((res) =>
      parseHistory([...res[0], ...res[1]])
    );
  };

  const parseHistory = (events: any[]) => {
    events.sort((a, b) => a.blockNumber - b.blockNumber);
    const historyMap: { [key: string]: any } = {};

    const history = [] as any[];
    const positions = [] as any[];
    events.forEach((v) => {
      const [
        trader,
        baseToken,
        positionHash,
        margin,
        positionSize,
        openNotional,
        isLong,
      ] = v.args;
      if (v.eventName == "UpdatePosition") {
        if (positionHash in historyMap) {
          if (historyMap[positionHash].margin - margin >= 0) {
            history.push({
              type: "Close",
              margin: historyMap[positionHash].margin - margin,
              positionSize:
                historyMap[positionHash].positionSize - positionSize,
              openNotional:
                historyMap[positionHash].openNotional - openNotional,
              isLong,
              blockNumber: v.blockNumber,
              transactionHash: v.transactionHash,
            });
          }

          historyMap[positionHash].margin = margin;
          historyMap[positionHash].positionSize = positionSize;
          historyMap[positionHash].openNotional = openNotional;
        } else {
          historyMap[positionHash] = {
            trader,
            baseToken,
            positionHash,
            margin,
            positionSize,
            openNotional,
            isLong,
          };

          history.push({
            type: "OPEN",
            margin,
            positionSize,
            openNotional,
            isLong,
            blockNumber: v.blockNumber,
            transactionHash: v.transactionHash,
          });
        }
      } else {
        history.push({
          type: "CLOSE",
          margin,
          positionSize,
          openNotional,
          isLong,
          blockNumber: v.blockNumber,
          transactionHash: v.transactionHash,
        });

        delete historyMap[positionHash];
      }
    });

    Object.keys(historyMap).forEach((v) => {
      positions.push(historyMap[v]);
    });

    setHistory(history.reverse());
    setPositions(positions);
  };

  useEffect(() => {
    getHistory();
  }, [signer]);

  useEffect(() => {
    getHistory();
  }, [blockNumber]);

  const [height, setHeight] = useState<number>(252);
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={`relative flex flex-col w-full bg-[#131722] text-[#72768f] font-semibold border-t-[0.6px] duration-200 ${
        isHover ? "border-[#6453E4]" : "border-[#363A45]"
      }  `}
    >
      <ResizeHandler setHeight={setHeight} setIsHover={setIsHover} />
      <div className="flex justify-between w-full h-12 items-center px-4 border-b-[0.6px] border-[#363A45] ">
        <div className="flex gap-4 ">
          <button
            className={`${selectedMenu === 0 ? "text-[#729aff]" : ""}`}
            onClick={() => setSelectedMenu(0)}
          >
            Position ({positions.length})
          </button>
          <button
            className={`${selectedMenu === 1 ? "text-[#729aff]" : ""}`}
            onClick={() => setSelectedMenu(1)}
          >
            Order (2)
          </button>
          <button
            className={`${selectedMenu === 2 ? "text-[#729aff]" : ""}`}
            onClick={() => setSelectedMenu(2)}
          >
            History
          </button>
        </div>
        <div className="flex">
          {selectedMenu != 2 && (
            <button className="text-[#729aff]" onClick={onClickCloseAll}>
              Close All
            </button>
          )}
          {/* <div className="h-6 mx-4"></div> */}
          {/* <button>All My Position &gt;</button> */}
        </div>
      </div>
      <div className="overflow-y-auto" style={{ height }}>
        {selectedMenu == 0 &&
          (positions.length ? (
            positions.map((v, i) => (
              <OrderHistoryCard
                key={`${v.positionHash} ${positions.length}`}
                type={selectedMenu}
                position={v}
              />
            ))
          ) : (
            <EmptyData menu="Positions" />
          ))}

        {selectedMenu == 1 &&
          cards[selectedMenu].map((v, i) => (
            <OrderHistoryCard key={i} type={selectedMenu} position={v} />
          ))}

        {selectedMenu == 2 &&
          (history.length ? (
            history.map((v, i) => (
              <OrderHistoryCard key={i} type={selectedMenu} position={v} />
            ))
          ) : (
            <EmptyData menu="History" />
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
