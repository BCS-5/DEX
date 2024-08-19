import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const networks = [
  {
    src: "/ethereum_logo.svg",
    chainId: 11155111,
    network: "Sepolia",
  },
];

async function switchNetwork(chainId: number) {
  try {
    // MetaMask에 네트워크 변경 요청
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  } catch (switchError) {}
}

const NetworkMenu: FC = () => {
  const { chainId } = useSelector((state: RootState) => state.providers);
  return (
    <div className="flex flex-col absolute w-[250px]  bg-[#1E1F31] text-[#f0f0f0] top-16 -translate-x-[102px] items-start rounded-[4px] z-10 border-[0.6px] border-[#363A45]">
      {networks.map((v) => (
        <div
          className="flex w-full items-center gap-2 p-4 hover:bg-[#24253B] text-[#72768f] hover:text-[#98A1F8]"
          onClick={() => switchNetwork(v.chainId)}
          key={v.chainId}
        >
          <img src={v.src} className="w-5 h-5" />
          <div className="text-[14px] font-semibold text-[#f0f0f0]">
            {v.network}
          </div>
          {v.chainId === chainId && (
            <div className="flex-1 flex justify-end">
              <div className="bg-[#1db1a8] w-2 h-2 rounded-full"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NetworkMenu;