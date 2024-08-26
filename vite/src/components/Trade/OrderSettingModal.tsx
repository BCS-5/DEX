import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setDeadline, setSlippage } from "../../features/events/eventsSlice";

const number_pattern = /^[0-9]*\.?[0-9]*$/;
const integer_pattern = /^[0-9]+$/;

interface OrderSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSettingModal: FC<OrderSettingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { slippage, deadline } = useSelector(
    (state: RootState) => state.events
  );

  const dispatch = useDispatch();

  const onChangeSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (number_pattern.test(e.target.value)) {
      if (Number(e.target.value) > 5) dispatch(setSlippage("5"));
      else if (Number(e.target.value) < 0.1) dispatch(setSlippage("0.1"));
      else dispatch(setSlippage(e.target.value));
    }
  };
  const onChangeDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (integer_pattern.test(e.target.value) || e.target.value === "") {
      if (Number(e.target.value) > 99) dispatch(setDeadline("99"));
      else if (Number(e.target.value) < 1) dispatch(setDeadline("1"));
      else dispatch(setDeadline(e.target.value));
    }
  };

  const onClickSlippageButton = (value: string) => {
    dispatch(setSlippage(value));
  };
  const onClickDeadlineButton = (value: string) => {
    dispatch(setDeadline(value));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-[#1E1F31] text-[#f0f0f0] w-[435px] rounded-lg shadow-lg relative z-10">
        <div className="w-full p-4 pb-0">
          <div className="flex justify-between content-center h-11 font-bold text-xl text-[#f0f0f0]">
            <div className="content-center">Settings</div>
          </div>
        </div>
        <div className="pl-5 mt-4 text-[#72768f] font-semibold">Slippage</div>
        <div className="flex p-4 mt-1 gap-2 text-[#f0f0f0]">
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              slippage == "0.5" && "bg-[#47496B]"
            }`}
            onClick={() => onClickSlippageButton("0.5")}
          >
            0.5%
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              slippage == "1" && "bg-[#47496B]"
            }`}
            onClick={() => onClickSlippageButton("1")}
          >
            1%
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              slippage == "2" && "bg-[#47496B]"
            }`}
            onClick={() => onClickSlippageButton("2")}
          >
            2%
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              slippage == "3" && "bg-[#47496B]"
            }`}
            onClick={() => onClickSlippageButton("3")}
          >
            3%
          </button>
          <div className="flex-1 flex justify-end">
            <div className="bg-[#3B3D59] rounded-xl flex justify-between  w-16 h-10">
              <input
                type="number"
                value={slippage}
                onChange={onChangeSlippage}
                className="text-right w-full h-10 bg-[#3B3D59] rounded-xl focus:outline-none"
                placeholder="0"
              />
              <div className="h-10 px-1 mt-2">%</div>
            </div>
          </div>
        </div>
        <div className="pl-5 text-[#72768f] font-semibold">Deadline</div>
        <div className="flex p-4 mt-1 gap-2 text-[#f0f0f0]">
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              deadline == "10" && "bg-[#47496B]"
            }`}
            onClick={() => onClickDeadlineButton("10")}
          >
            10M
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              deadline == "15" && "bg-[#47496B]"
            }`}
            onClick={() => onClickDeadlineButton("15")}
          >
            15M
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              deadline == "30" && "bg-[#47496B]"
            }`}
            onClick={() => onClickDeadlineButton("30")}
          >
            30M
          </button>
          <button
            className={`bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center ${
              deadline == "60" && "bg-[#47496B]"
            }`}
            onClick={() => onClickDeadlineButton("60")}
          >
            60M
          </button>
          <div className="flex-1 flex justify-end">
            <div className="bg-[#3B3D59] rounded-xl flex justify-between  w-16 h-10">
              <input
                type="number"
                value={deadline}
                onChange={onChangeDeadline}
                className="text-right w-full h-10 bg-[#3B3D59] rounded-xl focus:outline-none"
                placeholder="0"
              />
              <div className="h-10 px-1 mt-2">M</div>
            </div>
          </div>
        </div>

        <div className="flex p-4 gap-4">
          <button
            className="w-full h-12 text-center content-center rounded-lg bg-[#3B3D59] hover:bg-[#47496B] text-[#f0f0f0]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full h-12 text-center content-center rounded-lg text-[#f0f0f0] bg-gradient-to-r from-[#e05fbb] to-[#4250f4] hover:bg-[#8388F5] hover:from-[#4250f4] "
            onClick={() => {
              dispatch(setSlippage("0.5"));
              dispatch(setDeadline("10"));
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSettingModal;
