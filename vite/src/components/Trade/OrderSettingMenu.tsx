import { FC, useState } from "react";
import { MdSettings } from "react-icons/md";

interface OrderSettingMenuParams {
  slippage: string;
  deadline: string;
  setSlippage: React.Dispatch<React.SetStateAction<string>>;
  setDeadline: React.Dispatch<React.SetStateAction<string>>;
}

const number_pattern = /^[0-9]*\.?[0-9]*$/;
const integer_pattern = /^[0-9]+$/;

const OrderSettingMenu: FC<OrderSettingMenuParams> = ({
  slippage,
  setSlippage,
  deadline,
  setDeadline,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onChangeSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (number_pattern.test(e.target.value)) {
      if (Number(e.target.value) > 5) setSlippage("5");
      else if (Number(e.target.value) < 0.1) setSlippage("0.1");
      else setSlippage(e.target.value);
    }
  };
  const onChangeDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (integer_pattern.test(e.target.value) || e.target.value === "") {
      if (Number(e.target.value) > 99) setDeadline("99");
      else if (Number(e.target.value) < 1) setDeadline("1");
      else setDeadline(e.target.value);
    }
  };

  const onClickSlippageButton = (value: string) => {
    setSlippage(value);
  };
  const onClickDeadlineButton = (value: string) => {
    setDeadline(value);
  };
  return (
    <div className="relative z-20">
      <button>
        <MdSettings size={18} onClick={() => setIsOpen(!isOpen)} />
      </button>
      {isOpen && (
        <div className="flex flex-col absolute w-[377px] p-4 pt-3 bg-[#1E1F31] text-[#f0f0f0] top-8 -translate-x-[359px] items-start rounded-[4px] z-10 border-[0.6px] border-[#363A45]">
          <div className="font-semibold text-[14px]">Slippage</div>
          <div className="flex mt-4 gap-2 w-full justify-between">
            <div className="flex gap-2">
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickSlippageButton("0.1")}
              >
                0.1%
              </button>
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickSlippageButton("0.5")}
              >
                0.5%
              </button>
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickSlippageButton("1")}
              >
                1%
              </button>
            </div>
            <div className="relative flex justify-end">
              <input
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-3 w-[80px] outline-none bg-transparent"
                value={slippage}
                onChange={onChangeSlippage}
              />
              <div className="absolute top-2 right-2">%</div>
            </div>
          </div>
          <div className="font-semibold text-[14px] mt-4">Deadline</div>
          <div className="flex mt-4 gap-2 w-full justify-between">
            <div className="flex gap-2">
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickDeadlineButton("5")}
              >
                5 Min
              </button>
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickDeadlineButton("10")}
              >
                10 Min
              </button>
              <button
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-4 w-[80px] text-[14px]"
                onClick={() => onClickDeadlineButton("15")}
              >
                15 Min
              </button>
            </div>
            <div className="relative flex justify-end">
              <input
                className="border-[0.6px] border-[#363A45] rounded-[6px] h-fit py-2 px-3 w-[80px] outline-none bg-transparent text-[14px]"
                value={deadline}
                onChange={onChangeDeadline}
              />
              <div className="absolute top-2 right-2">Min</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSettingMenu;
