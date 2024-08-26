import { FC, useEffect, useState } from "react";
import OrderHistoryCard from "./OrderHistoryCard";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import EmptyData from "./EmptyData";
import ResizeHandler from "./ResizeHandler";
import { notify } from "../../lib";


const OrderHistory: FC = () => {
  const { clearingHouseContract, virtualTokenContracts, routerContract, orderContract } =
    useSelector((state: RootState) => state.contracts);

  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const { positions, orders, history } = useSelector(
    (state: RootState) => state.history
  );

  const [selectedMenu, setSelectedMenu] = useState<number>(0);


  const onClickCancelAll = () => {
    const orderIds:bigint[] = [] ;
    orders.forEach((v) => {
      orderIds.push(v.orderId)
    })

    orderContract?.cancelOrderBatch(orderIds).then((tx) => {
      notify("Pending Transaction ...", true);
      tx.wait().then(() =>
        notify("Transaction confirmed successfully !", true)
      );
    })
    .catch((error) => notify(error.shortMessage, false));
  }

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

    Promise.all(promises).then(() => {
      clearingHouseContract
        ?.closePositionBatch(
          baseTokens,
          positionHashs,
          slippageAdjustedAmounts,
          Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
        )
        .then((tx) => {
          notify("Pending Transaction ...", true);
          tx.wait().then(() =>
            notify("Transaction confirmed successfully !", true)
          );
        })
        .catch((error) => notify(error.shortMessage, false));
    });
  };

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
            Order ({orders.length})
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
            <button className="text-[#729aff]" onClick={() => selectedMenu == 0 ? onClickCloseAll() : onClickCancelAll()}>
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
            positions.map((v) => (
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
          (orders.length ? (
            orders.map((v, i) => (
              <OrderHistoryCard key={i} type={selectedMenu} position={v} />
            ))
          ) : (
            <EmptyData menu="Orders" />
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
