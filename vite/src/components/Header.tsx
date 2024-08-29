import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import {
  setProvider,
  setSigner,
  setChainId,
} from "../features/providers/providersSlice";
import {
  setContract,
  setPairs,
  setVirtualTokens,
} from "../features/contracts/contractsSlice";
import DropDownButton from "./Header/DropDownButton";
import WalletMenu from "./Header/WalletMenu";
import NetworkMenu from "./Header/NetworkMenu";
import { contracts } from "../contracts/addresses";
import { Contract } from "ethers";
import { newBlockHeads } from "../features/events/eventsSlice";

const navLinks = [
  {
    name: "Market",
    path: "/Market",
  },
  {
    name: "Trade",
    path: "/Trade",
  },
  {
    name: "Earn",
    path: "/Staking",
  },
  {
    name: "Portfolio",
    path: "/Portfolio",
  },
];

const Header: FC = () => {
  const navigate = useNavigate();
  const { provider, signer, chainId } = useSelector(
    (state: RootState) => state.providers
  );
  const { marketRegistryContract } = useSelector(
    (state: RootState) => state.contracts
  );
  const dispatch = useDispatch();

  const subscribeNewblockHeads = (blockNumber: number) => {
    dispatch(newBlockHeads(blockNumber));
  };

  useEffect(() => {
    if (!provider || chainId !== 11155111) return;
    provider.on("block", subscribeNewblockHeads);
    return () => {
      provider.removeListener("block", subscribeNewblockHeads);
    };
  }, [provider, chainId]);

  useEffect(() => {
    if (!provider) {
      dispatch(setProvider(window.ethereum));
    }

    window.ethereum.on("chainChanged", (chainId: string) => {
      dispatch(setChainId(parseInt(chainId, 16)));
    });
  }, []);

  useEffect(() => {
    if (provider) {
      if (!signer) {
        dispatch(setContract(provider));
      }

      const isLogin = localStorage.getItem("login");
      if (isLogin) {
        onClickConnectWallet();
      }

      provider
        .getNetwork()
        .then((network) => dispatch(setChainId(Number(network.chainId))));
    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      dispatch(setContract(signer));
    }
  }, [signer]);

  useEffect(() => {
    if (provider) {
      marketRegistryContract?.getAllBaseTokens().then((data) => {
        data.forEach((address: string) => {
          const tokenContract = new Contract(
            address,
            contracts.virtualToken.abi,
            provider
          );
          tokenContract.symbol().then((name: string) => {
            dispatch(setVirtualTokens({ name, address, provider }));
            marketRegistryContract
              .getPool(address)
              .then((address: string) =>
                dispatch(setPairs({ name, address, provider }))
              );
          });
        });
      });
      marketRegistryContract?.getQuoteToken().then((address) => {
        const tokenContract = new Contract(
          address,
          contracts.virtualToken.abi,
          provider
        );
        tokenContract
          .symbol()
          .then((name) =>
            dispatch(setVirtualTokens({ name, address, provider }))
          );
      });
    }
  }, [marketRegistryContract]);

  const onClickConnectWallet = () => {
    // localStorage.setItem("login", "true");
    provider?.getSigner().then((signer) => dispatch(setSigner(signer)));
  };

  return (
    <div
      className="flex w-auto h-[64px] justify-between bg-[#131722] text-white border-b-[0.6px] border-[#363A45] tracking-tight"
      style={{ fontFamily: "Roboto-Medium" }}
    >
      <div className="relative flex gap-8">
        <div className="flex items-center pl-2 w-[150px]">
          <img
            src="/logo9.png"
            className="absolute left-[25px] h-[80px] -bottom-[8px] cursor-pointer object-contain"
            onClick={() => navigate("/")}
          />
          {/* <img
            src="/fix.png"
            className="absolute left-[70px]  h-[68px] cursor-pointer object-contain"
            onClick={() => navigate("/")}
          /> */}
        </div>
        <div className="flex gap-8">
          {navLinks.map((v, i) => (
            <button
              key={i}
              className="hover:text-[#AB72E3] text-[16px]"
              onClick={() => navigate(v.path)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-[450px] items-center pr-4 gap-4 justify-end">
        {chainId === 11155111 ? (
          <DropDownButton
            text={`Sepolia`}
            MenuComponent={NetworkMenu}
            src="/ethereum_logo.svg"
          />
        ) : (
          <DropDownButton text={`Wrong Network`} MenuComponent={NetworkMenu} />
        )}
        {signer ? (
          <DropDownButton
            text={`${signer?.address.slice(0, 6)}...${signer?.address.slice(
              signer.address.length - 4
            )}`}
            MenuComponent={WalletMenu}
          />
        ) : (
          <button
            className="flex justify-center items-center rounded-[4px] h-10 px-3 py-[6px]  w-[150px] text-white text-[14px] font-[500] tracking-normal "
            style={{ background: "linear-gradient(90deg, #e05fbb, #4250f4)" }}
            onClick={onClickConnectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
