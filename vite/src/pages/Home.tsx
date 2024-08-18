import { FC } from "react";
import ProviderSetup from "../components/ProviderSetup";
import UseProvider from "../components/UseProvider";
import CardSection from "../components/Home/CardSection";
import FAQList from "../components/Home/FAQList";
import Footer from "../components/Home/Footer";
import Header2 from "../components/Home/Header2";
import Explain from "../components/Home/Explain";
import Top from "../components/Home/Top";

const App: FC = () => {
  return (
    <>
      <div className="bg-red-100">
        <ProviderSetup />
        <UseProvider />
      </div>
      <Header2 />
      <Top />
      <div className=" justify-center px-80 pt-14">
        <Explain />
        <CardSection />
        <FAQList />
      </div>
      <Footer />
    </>
  );
};

export default App;
