import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

import Staking from "./pages/Staking";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Mint from "./pages/Mint";
import Pool from "./pages/Pool";
import Claim from "./pages/Claim";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/trade" element={<Trade />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/pool/:poolAddr" element={<Pool />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
