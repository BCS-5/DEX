import { FC } from "react";

interface OrderHistoryCardParams {
  type: number;
}

const menuType = [0b10011110, 0b10101100, 0b01001111];

const OrderHistoryCard: FC<OrderHistoryCardParams> = ({ type }) => {
  const checkType = (bit: number) => {
    return (menuType[type] & (1 << bit)) != 0;
  };

  return (
    <div className={`h-[62px] px-6 flex hover:bg-[#1E1F31] cursor-pointer`}>
      <div className="flex text-[#f0f0f0] justify-between min-w-[906px] flex-grow flex-shrink-0 items-center">
        <div className="flex items-center w-[110px] flex-1 gap-2">
          <img
            src="https://api.synfutures.com/ipfs/icons/token/btc.png"
            className="w-5 h-5"
          />
          <div className="flex flex-col ">
            <div className="text-sm">BTCUSD</div>
            <div className="text-xs text-[#2BBDB5]">Long 20.0x</div>
          </div>
        </div>
        {checkType(0) && (
          <div className="flex flex-col w-[120px] flex-1">
            <div className="text-sm text-[#f0f0f0]">CLOSE</div>
            <div className="text-xs text-[#72768f]">Type</div>
          </div>
        )}
        {checkType(1) && (
          <div className="flex flex-col w-[120px] flex-1">
            <div className="text-sm text-[#2BBDB5]">+0.54 USDT</div>
            <div className="text-xs text-[#72768f]">
              PNL
              <span className="text-[#2BBDB5]"> +5.62%</span>
            </div>
          </div>
        )}
        {checkType(2) && (
          <div className="flex flex-col w-[120px] flex-1">
            <div className="text-sm">10.01 USDT</div>
            <div className="flex items-center text-xs text-[#72768f] font-normal">
              <span> {type != 1 ? "Initial Margin" : "Collateral"}</span>
              {type === 0 && (
                <button>
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
            <div className="text-sm">199.9</div>
            <div className="text-xs text-[#72768f] font-normal">Size (USD)</div>
          </div>
        )}
        {checkType(4) && (
          <>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">58,496.6</div>
              <div className="text-xs text-[#72768f] font-normal">
                Entry Price
              </div>
            </div>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">58,396.2</div>
              <div className="text-xs text-[#72768f] font-normal">
                Mark Price
              </div>
            </div>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">55,862.6</div>
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
              <div className="text-sm">55,862.6</div>
              <div className="text-xs text-[#72768f] font-normal">
                Close Price
              </div>
            </div>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">0.10 USDT</div>
              <div className="text-xs text-[#72768f] font-normal">Fee</div>
            </div>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm">08-12 14:18:14</div>
              <div className="text-xs text-[#72768f] font-normal">
                Time (UTC)
              </div>
            </div>
            <div className="flex flex-col w-[100px] flex-1">
              <div className="text-sm text-[#7e9aff]">
                <a
                  href="https://sepolia.etherscan.io/tx/0xa9764bbf45fb7620a5d015c212349064e58f1acf52e4849658af72d2098d760b"
                  target="_blank"
                >
                  0xa9764bbf4...
                </a>
              </div>
              <div className="text-xs text-[#72768f] font-normal">
                Transaction Hash
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex min-w-[147px] items-center justify-end flex-grow">
        {checkType(7) && (
          <button className="w-[55px] h-[28px] rounded-[4px]  text-xs bg-[#2C2D43] py-[6px] px-3">
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryCard;