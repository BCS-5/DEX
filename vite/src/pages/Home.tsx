import { FC } from "react";
import useScrollFadeIn from "../components/Home/ScrollEvent";
import CardSection from "../components/Home/CardSection";
import FAQList from "../components/Home/FAQList";
import Footer from "../components/Home/Footer";
import Header2 from "../components/Home/Header2";
import Explain from "../components/Home/Explain";
import Top from "../components/Home/Top";

const App: FC = () => {
  const fadeInFromUp = useScrollFadeIn("up", 2, 0);
  const fadeInFromLeft = useScrollFadeIn("left", 2, 0);

  return (
    <>
      <Header2 />
      <Top />
      <div className=" justify-center px-80 pt-14">
        <div {...fadeInFromUp}>
          <Explain />
        </div>
        <div {...fadeInFromLeft}>
          <CardSection />
        </div>
        <FAQList />
      </div>
      <Footer />
    </>
  );
};

export default App;
