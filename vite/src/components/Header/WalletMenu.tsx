import { FC } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineContentCopy,
} from "react-icons/md";
import { RxExit } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { setSigner } from "../../features/providers/providersSlice";
const WalletMenu: FC = () => {
  const dispatch = useDispatch();
  const onClickDisConnect = () => {
    dispatch(setSigner(null));
  };
  return (
    <div className="flex flex-col absolute w-[250px]  bg-[#1E1F31] text-[#f0f0f0] top-16 -translate-x-[102px] pt-3 items-start rounded-[4px] z-10 border-[0.6px] border-[#363A45]">
      <div className="flex flex-col items-start px-4 text-[#72768f] hover:text-[#98A1F8]">
        <div className="text-[#72768f] text-[14px]">My Wallet</div>
        <div className="flex items-center gap-2 ">
          <div className="text-[20px] font-semibold text-[#f0f0f0]">
            0x0000...F0E3
          </div>
          <MdOutlineContentCopy size={14} className="mt-1" />
        </div>
      </div>
      <div className="flex items-center w-full gap-2 p-4 hover:bg-[#24253B] text-[#72768f] hover:text-[#98A1F8]">
        <MdOutlineAccountBalanceWallet size={20} />
        <div className="text-[14px] font-semibold text-[#f0f0f0]">My Asset</div>
      </div>
      <div className="flex items-center w-full gap-2 p-4 hover:bg-[#24253B] text-[#72768f] hover:text-[#98A1F8]">
        <FiExternalLink size={20} />
        <div className="text-[14px] font-semibold text-[#f0f0f0]">
          View on explorer
        </div>
      </div>
      <div className="w-full my-1 border-t-[0.6px] border-[#363A45]"></div>
      <div
        className="flex items-center w-full gap-2 p-4 hover:bg-[#24253B] text-[#72768f] hover:text-[#98A1F8]"
        onClick={onClickDisConnect}
      >
        <RxExit size={20} />
        <div className="text-[14px] font-semibold text-[#f0f0f0]">
          Disconnect
        </div>
      </div>
    </div>
  );
};

export default WalletMenu;