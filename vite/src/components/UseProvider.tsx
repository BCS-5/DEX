import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const UseProvider: React.FC = () => {
  const provider = useSelector((state: RootState) => state.ethers.provider);

  const getNetwork = async () => {
    if (provider) {
      const network = await provider.getNetwork();
      console.log("Network:", network);
    } else {
      console.error("Provider is not initialized");
    }
  };

  return (
    <div>
      <button onClick={getNetwork}>Get Network</button>
    </div>
  );
};

export default UseProvider;
