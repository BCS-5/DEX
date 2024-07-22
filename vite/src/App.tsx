import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Staking from "./pages/Staking";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Mint from "./pages/Mint";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/staking" element={<Staking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
