import { Contract } from "ethers";
import { JsonRpcSigner, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";

export const getSigner = async (
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>
) => {
  if (!window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);

  setSigner(await provider.getSigner());
};

export const useMetamask = async (
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>
) => {
  try {
    getSigner(setSigner);

    localStorage.setItem("isLogin", "true");
  } catch (error) {
    console.error(error);
  }
};

export function formatVolume(num: number) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toFixed(1);
  }
}

export function formatPrice(num: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatUTCDate(timestamp: number): string {
  const date = new Date(timestamp);

  // UTC 시간으로 추출
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const day = String(date.getUTCDate()).padStart(2, "0"); // 일
  const hours = String(date.getUTCHours()).padStart(2, "0"); // 시
  const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // 분
  const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // 초

  // 원하는 포맷으로 출력 (MM-DD HH:MM:SS)
  return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function getSlippageAdjustedAmount(
  routerContract: Contract,
  amountIn: bigint,
  amountOut: bigint,
  path: string[],
  isExact: boolean,
  slippage: string
) {
  if (isExact) {
    const amounts = await routerContract?.getAmountsOut(amountIn, path);
    return (
      amounts[1] -
      BigInt(Math.floor((Number(amounts[1]) * Number(slippage)) / 100))
    );
  } else {
    const amounts = await routerContract?.getAmountsIn(amountOut, path);
    return (
      amounts[0] +
      BigInt(Math.floor((Number(amounts[0]) * Number(slippage)) / 100))
    );
  }
}

export const notify = (message: string, isSuccess: boolean) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    icon: <MdError size={24} />,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: `${
      isSuccess ? "bg-success-color" : "bg-error-color"
    } text-white`,
    bodyClassName: "font-bold",
    progressClassName: `${isSuccess ? "bg-green-600" : "bg-red-600"}`,
  });
};
