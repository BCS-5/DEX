import { FC, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setHistory, setPositions } from "../features/history/historySlice";

const UpdateOrderHistory: FC = () => {
  const { clearingHouseContract } = useSelector(
    (state: RootState) => state.contracts
  );

  const dispatch = useDispatch();

  const { signer } = useSelector((state: RootState) => state.providers);
  const { blockNumber } = useSelector((state: RootState) => state.events);

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

    dispatch(setHistory(history.reverse()));
    dispatch(setPositions(positions));
  };

  useEffect(() => {
    getHistory();
  }, [signer]);

  useEffect(() => {
    getHistory();
  }, [blockNumber]);

  return <></>;
};

export default UpdateOrderHistory;
