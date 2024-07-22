import { FC } from "react";
import ProviderSetup from "../components/ProviderSetup";
import UseProvider from "../components/UseProvider";

const App: FC = () => {
  return (
    <div>
      <ProviderSetup />
      <UseProvider />
    </div>
  );
};

export default App;
