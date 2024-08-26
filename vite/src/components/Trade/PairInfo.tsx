import { FC, useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setMarkPrice } from "../../features/events/eventsSlice";
import { formatPrice, formatVolume } from "../../lib";

const PairContainer: FC = () => {
  const {
    virtualTokenContracts,
    accountBalanceContract,
  } = useSelector((state: RootState) => state.contracts);

  const { markPrice } = useSelector((state: RootState) => state.events);

  const dispatch = useDispatch();

  const { blockNumber } = useSelector((state: RootState) => state.events);

  const [percent, setPercent] = useState<string>("0.0");
  const [indexPrice, setIndexPrice] = useState<string>("0.0");
  const [longOI, setLongOI] = useState<string>("0.0");
  const [shortOI, setShortOI] = useState<string>("0.0");
  const [longFundingRate, setLongFundingRate] = useState<string>("0.0");
  const [shortFundingRate, setShortFundingRate] = useState<string>("0.0");
  const [volume, setVolume] = useState<string>("0.0");

  const getMarkPrice = () => {
    const url = `http://141.164.38.253:8090/api/latest?symbol=BTC&resolution=1D`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.open == 0) data.open = 64157;
        dispatch(setMarkPrice(formatPrice(data.close)));

        setPercent((((data.close - data.open) / data.open) * 100).toFixed(2));
      });
  };
  const getIndexPrice = () => {
    if (!virtualTokenContracts?.BTC?.target) return;
    accountBalanceContract
      ?.getIndexPrice(virtualTokenContracts?.BTC?.target)
      .then((price) => {
        setIndexPrice(formatPrice(Number(price) / 10 ** 18));
      });
  };

  const getFundingRate = () => {
    fetch("http://141.164.38.253:8090/api/getPerpetualPool?token=BTC").then(
      (res) =>
        res.json().then((data) => {
          const _longFundingRate = BigInt(data[0].long) - BigInt(data[1].long);
          const _shortFundingRate =
            BigInt(data[0].short) - BigInt(data[1].short);

          const _long = (Number(_longFundingRate) / 10 ** 18).toFixed(5);
          const _short = (Number(_shortFundingRate) / 10 ** 18).toFixed(5);

          setLongFundingRate(Number(_long) == 0 ? "0.0000" : _long);
          setShortFundingRate(Number(_short) == 0 ? "0.0000" : _short);
        })
    );
  };

  const getOpenOI = () => {
    if (!virtualTokenContracts?.BTC?.target) return;
    accountBalanceContract
      ?.getLongOpenInterest(virtualTokenContracts?.BTC?.target)
      .then((data) => setLongOI((Number(data) / 10 ** 8).toFixed(4)));

    accountBalanceContract
      ?.getShortOpenInterest(virtualTokenContracts?.BTC?.target)
      .then((data) => setShortOI((Number(data) / 10 ** 8).toFixed(4)));
  };

  const getVolume = () => {
    fetch("http://141.164.38.253:8090/api/getRecentVolume").then((res) =>
      res.json().then((data) => {
        setVolume(formatVolume(data.volume));
      })
    );
  };

  useEffect(() => {
    getMarkPrice();
    getIndexPrice();
    getFundingRate();
    getOpenOI();
    getVolume();
  }, [blockNumber]);

  useEffect(() => {
    getIndexPrice();
    getOpenOI();
  }, [accountBalanceContract, virtualTokenContracts]);

  return (
    <div className="flex w-full h-[80px] px-5 bg-[#131722] text-[#f0f0f0] items-center border-b-[0.6px] border-[#363A45]">
      <div className="flex w-full pl-2 gap-4 ">
        <div className="flex items-center">
          <img
            src="https://api.synfutures.com/ipfs/icons/token/btc.png"
            className="w-6 h-6"
          />
          <div className="flex flex-col  justify-center ml-2 font-semibold">
            <button className="flex items-center gap-4">
              BTC/USD <MdArrowDropDown size={24} />
            </button>
          </div>
        </div>
        <div className="border-r-[0.6px] border-[#363A45]"></div>
        <div className="flex ml-1 mr-[6px] flex-col items-end justify-center">
          <div
            className={`text-sm tracking-wide ${
              Number(percent) > 0 ? "text-[#2BBDB5]" : "text-[#FF5AB5]"
            }  font-semibold`}
          >
            {markPrice}
          </div>
          <span
            className={`text-xs ${
              Number(percent) > 0 ? "text-[#2BBDB5]" : "text-[#FF5AB5]"
            }`}
          >
            {Number(percent) > 0 && "+"}
            {percent}%
          </span>

          {/* <span className="text-xs text-[#2BBDB5]"></span> */}
        </div>
        <div className="border-r-[0.6px] border-[#363A45]"></div>
        <div className="flex  flex-col w-[45%] justify-center">
          <div className="flex w-full text-sm  font-semibold">
            <span className="flex-1">{indexPrice}</span>
            <span className="flex-1">{longOI} BTC</span>
            <span className="flex-1">{shortOI} BTC</span>
            <span className="flex-1">${volume} </span>
            <span
              className={`flex-1 ${
                Number(longFundingRate) >= 0
                  ? "text-[#2BBDB5]"
                  : "text-[#FF5AB5]"
              }`}
            >
              {longFundingRate}%
            </span>
            <span
              className={`flex-1 ${
                Number(shortFundingRate) >= 0
                  ? "text-[#2BBDB5]"
                  : "text-[#FF5AB5]"
              }`}
            >
              {shortFundingRate}%
            </span>
          </div>
          <div className="flex w-full text-xs text-[#72768f]">
            <span className="flex-1">Index Price</span>
            <span className="flex-1">Long OI</span>
            <span className="flex-1">Short OI</span>
            <span className="flex-1">24H Volume</span>
            <span className="flex-1">1h Funding (Long)</span>
            <span className="flex-1">1h Funding (Short)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairContainer;
