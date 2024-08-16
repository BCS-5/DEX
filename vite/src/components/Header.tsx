import { JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useMetamask } from "../lib";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

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
    name: "Portfolio",
    path: "/Portfolio",
  },
  {
    name: "Mint",
    path: "/Mint",
  },
  {
    name: "Staking",
    path: "/Staking",
  },
];

const Header: FC<HeaderProps> = ({ signer, setSigner }) => {
  const navigate = useNavigate();

  const onClickLogOut = () => {
    setSigner(null);
    localStorage.setItem("isLogin", "false");
  };

  return (
    <div className="flex w-auto justify-between m-2">
      <div className="flex gap-8">
        <div>logo</div>
        <div className="flex gap-4">
          {navLinks.map((v, i) => (
            <button
              key={i}
              className="hover:underline"
              onClick={() => navigate(v.path)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        {signer ? (
          <button onClick={onClickLogOut}>
            ${signer.address.substring(0, 7)}... Logout
          </button>
        ) : (
          <button onClick={() => useMetamask(setSigner)}>Connect wallet</button>
        )}
      </div>
    </div>
  );
};

export default Header;
