import { FC, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  callback: (closePercent: string) => void;
}

const CloseModal: FC<ModalProps> = ({ isOpen, onClose, callback }) => {
  if (!isOpen) return null;

  const [value, setValue] = useState("100");

  const handleChange = (e: any) => {
    const inputValue = e.target.value;

    // 소수점이 포함되지 않고 숫자 범위가 1에서 100 사이일 때만 업데이트
    if (
      /^\d*$/.test(inputValue) &&
      (inputValue === "" ||
        (Number(inputValue) >= 1 && Number(inputValue) <= 100))
    ) {
      setValue(inputValue);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-[#1E1F31] w-[435px] rounded-lg shadow-lg relative z-10">
        <div className="w-full p-4 pb-0">
          <div className="flex justify-between content-center h-11 font-bold text-xl text-[#f0f0f0]">
            <div className="content-center">Close Position</div>
          </div>
        </div>

        <div className="flex p-4 mt-4 gap-2 text-[#f0f0f0]">
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center"
            onClick={() => setValue("25")}
          >
            25%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center"
            onClick={() => setValue("50")}
          >
            50%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center"
            onClick={() => setValue("75")}
          >
            75%
          </button>
          <button
            className="bg-[#3B3D59] hover:bg-[#47496B] rounded-xl p-2 mb-4 flex-1 text-center"
            onClick={() => setValue("100")}
          >
            100%
          </button>
          <div className="flex-1 flex justify-end">
            <div className="bg-[#3B3D59] rounded-xl flex justify-between  w-16 h-10">
              <input
                type="number"
                value={value}
                onChange={handleChange}
                min="1"
                max="100"
                step="1" // 소수점 방지
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "e") {
                    e.preventDefault(); // 소수점(.)과 지수 표현(e)을 입력 방지
                  }
                }}
                className="text-right w-full h-10 bg-[#3B3D59] rounded-xl focus:outline-none"
                placeholder="0"
              />
              <div className="h-10 px-1 mt-2">%</div>
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
            // style={{ background: "linear-gradient(90deg, #e05fbb, #4250f4)" }}
            onClick={() => {
              callback(value);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseModal;
