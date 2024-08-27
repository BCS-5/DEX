import { FC, useEffect, useState } from "react";
import OrderInput from "./OrderInput";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import OrderLeverageRange from "./OrderLeverageRange";
import OrderInfo from "./OrderInfo";
import OrderButton from "./OrderButton";
import OrderSettingMenu from "./OrderSettingMenu";
import { formatEther, formatUnits } from "ethers";
import Deposit from "./Deposit";

const Order: FC = () => {
  const {
    routerContract,
    virtualTokenContracts,
    accountBalanceContract,
    vaultContract,
  } = useSelector((state: RootState) => state.contracts);
  const { blockNumber } = useSelector((state: RootState) => state.events);

  const { signer } = useSelector((state: RootState) => state.providers);

  const [isLong, setIsLong] = useState<boolean>(true);
  const [isMarket, setIsMarket] = useState<boolean>(true);

  const [limitPrice, _setLimitPrice] = useState<string>("58000");
  const [quoteValue, _setQuoteValue] = useState<string>("");
  const [baseValue, _setBaseValue] = useState<string>("");

  const [isExactInput, setIsExactInput] = useState<boolean>(false);

  const [leverageValue, _setLeverageValue] = useState<number>(1);
  const [focusLeverage, setFocusLeverage] = useState<boolean>(false);

  const BASE = virtualTokenContracts["BTC"];
  const QUOTE = virtualTokenContracts["USDT"];

  const [baseDecimals, setBaseDecimals] = useState(8n);
  const [quoteDecimals, setQuoteDecimals] = useState(6n);

  const [collateral, setCollateral] = useState<string>("0.0");

  useEffect(() => {
    BASE?.decimals().then(setBaseDecimals);
  }, [BASE]);

  useEffect(() => {
    QUOTE?.decimals().then(setQuoteDecimals);
  }, [QUOTE]);

  useEffect(() => {
    if (!accountBalanceContract || !virtualTokenContracts) return;
    accountBalanceContract
      .getIndexPrice(virtualTokenContracts?.BTC?.target)
      .then((price) => setLimitPrice(Number(formatEther(price)).toFixed(1)));
  }, [accountBalanceContract, virtualTokenContracts]);

  useEffect(() => {
    vaultContract
      ?.getTotalCollateral(signer?.address)
      .then((data) => setCollateral(Number(formatUnits(data, 6)).toFixed(2)));
  }, [vaultContract, signer, blockNumber]);

  useEffect(() => {
    if (quoteValue === "" || baseValue === "" || focusLeverage) return;
    if (!isMarket) {
      preOrder(isExactInput ? quoteValue : baseValue, isExactInput);
      return;
    }
    if (isExactInput) {
      if (isLong) {
        exactInput(quoteValue);
      } else {
        exactOutput(quoteValue);
      }
    } else {
      if (isLong) {
        exactOutput(baseValue);
      } else {
        exactInput(baseValue);
      }
    }
  }, [leverageValue, isLong, focusLeverage, limitPrice, isMarket]);

  const setLimitPrice = (value: string) => {
    _setLimitPrice(value);
  };

  const setQuoteValue = (value: string) => {
    // if (Number(value) > Number(collateral)) {
    //   value = collateral;
    // }
    setIsExactInput(true);
    _setQuoteValue(value);
    if (!isMarket) {
      preOrder(value, true);
      return;
    }

    if (isLong) exactInput(value);
    else exactOutput(value);
  };

  const setBaseValue = (value: string) => {
    setIsExactInput(false);
    _setBaseValue(value);
    if (!isMarket) {
      preOrder(value, false);
      return;
    }

    if (isLong) exactOutput(value);
    else exactInput(value);
  };

  const preOrder = (value: string, isExact: boolean) => {
    if (isExact) {
      _setBaseValue(
        ((Number(value) * leverageValue) / Number(limitPrice)).toFixed(8)
      );
    } else {
      _setQuoteValue(
        ((Number(value) * Number(limitPrice)) / leverageValue).toFixed(6)
      );
    }
  };

  const exactInput = (value: string) => {
    const path = isLong
      ? [QUOTE.target, BASE.target]
      : [BASE.target, QUOTE.target];

    const [inputDecimals, outputDecimals] = isLong
      ? [Number(quoteDecimals), Number(baseDecimals)]
      : [Number(baseDecimals), Number(quoteDecimals)];

    const _setValue = isLong ? _setBaseValue : _setQuoteValue;

    const _leverageValue = isLong ? leverageValue : 1;
    const _divValue = isLong ? 1 : leverageValue;

    routerContract
      ?.getAmountsOut(
        Number(value) * 10 ** inputDecimals * _leverageValue,
        path
      )
      .then((amounts) => {
        _setValue(
          String(Number(amounts[1]) / 10 ** outputDecimals / _divValue)
        );
      })
      .catch(() => _setValue(""));
  };

  const exactOutput = (value: string) => {
    const path = isLong
      ? [QUOTE.target, BASE.target]
      : [BASE.target, QUOTE.target];

    const [inputDecimals, outputDecimals] = isLong
      ? [Number(baseDecimals), Number(quoteDecimals)]
      : [Number(quoteDecimals), Number(baseDecimals)];

    const _setValue = isLong ? _setQuoteValue : _setBaseValue;
    const _leverageValue = isLong ? 1 : leverageValue;
    const _divValue = isLong ? leverageValue : 1;

    routerContract
      ?.getAmountsIn(Number(value) * 10 ** inputDecimals * _leverageValue, path)
      .then((amounts) =>
        _setValue(String(Number(amounts[0]) / 10 ** outputDecimals / _divValue))
      )
      .catch(() => _setValue(""));
  };

  const setLeverageValue = (value: string) => {
    _setLeverageValue(Number(value));
  };

  return (
    <div className="flex flex-col justify-between h-full bg-[#131722] text-[#72768f] p-4 pt-7 border-l-[0.6px] border-[#363A45] w-full overflow-x-hidden">
      <div className="flex flex-col">
        <div className="flex w-full items-center h-10 justify-between rounded-[4px] bg-[#242534] ">
          <button
            className={`flex justify-center items-center w-full h-10 rounded-[4px]
              ${isLong ? "bg-[#1DB1A8] text-white" : ""}`}
            onClick={() => setIsLong(true)}
          >
            Long
          </button>
          <button
            className={`flex justify-center items-center w-full h-10 rounded-[4px]
              ${isLong ? "" : "bg-[#fd5cb7] text-white"}`}
            onClick={() => setIsLong(false)}
          >
            Short
          </button>
        </div>
        <div className="flex w-full items-center h-14 justify-between">
          <div className="flex gap-4">
            <button
              className={`${
                isMarket ? "text-[#f0f0f0]" : ""
              } hover:text-[#7e9aff]`}
              onClick={() => setIsMarket(true)}
            >
              Market
            </button>
            <button
              className={`${
                isMarket ? "" : "text-[#f0f0f0]"
              } hover:text-[#7e9aff]`}
              onClick={() => setIsMarket(false)}
            >
              Limit
            </button>
          </div>
          <OrderSettingMenu />
        </div>
        <div className="flex flex-col w-full gap-2">
          {!isMarket && (
            <OrderInput
              value={limitPrice}
              setValue={setLimitPrice}
              symbol="USD"
              placeholder="Limit Price"
            />
          )}
          <button
            className={`self-end text-[12px] font-semibold tracking-tighter mt-2 ${
              Number(quoteValue) > Number(collateral) && "text-red-500"
            }`}
            onClick={() => setQuoteValue(collateral)}
          >
            Available: {collateral} USDT
            {/* Available: 22.17 USDT */}
          </button>
          <OrderInput
            value={quoteValue}
            setValue={setQuoteValue}
            symbol="USDT"
            placeholder="Collateral"
          />
          <OrderInput
            value={baseValue}
            setValue={setBaseValue}
            symbol="BTC"
            placeholder="Position Size"
          />
        </div>
        <OrderLeverageRange
          leverageValue={leverageValue}
          setLeverageValue={setLeverageValue}
          focusLeverage={focusLeverage}
          setFocusLeverage={setFocusLeverage}
        />
        <OrderInfo
          quoteValue={quoteValue}
          baseValue={baseValue}
          leverageValue={leverageValue}
          isLong={isLong}
        />
        <OrderButton
          collateral={collateral}
          quoteValue={quoteValue}
          baseValue={baseValue}
          leverageValue={leverageValue}
          isLong={isLong}
          isMarket={isMarket}
          isExactInput={isExactInput}
        />
      </div>

      <div className="h-fit">
        <Deposit />
      </div>
    </div>
  );
};

export default Order;
