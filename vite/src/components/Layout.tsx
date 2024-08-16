import { FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { JsonRpcSigner } from "ethers";
import { getSigner } from "../lib";
import { Dispatch } from "redux";

export interface OutletContext {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    const localIsLogin = localStorage.getItem("isLogin");

    if (localIsLogin === "true") {
      getSigner(setSigner);
    }
  }, []);

  return (
    <>
      <Header signer={signer} setSigner={setSigner} />
      <Outlet context={{ signer, setSigner }} />
    </>
  );
};

export default Layout;
