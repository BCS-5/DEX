import { JsonRpcSigner, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";

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
