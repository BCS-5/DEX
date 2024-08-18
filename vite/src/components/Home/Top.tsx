import { useNavigate } from "react-router-dom";
import bg_img from "../Home/img/home.png";
import page_1 from "../img/page_1.png";
import page_2 from "../img/page_2.png";
import image_1 from "./img/image_1.png";
import pair from "../img/pair.png";
import price from "../img/price.png";
import bg from "./img/bg.jpeg";
import bitcoinImg from "./img/bitcoin.webp";
import ethImg from "./img/ethereum.webp";
import tetherImg from "./img/Tether.webp";
import totem from "./img/Graphic-Hero-Stem.svg";

const Top = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative flex items-center justify-left bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${bg_img})` }}
    >
      <>
        {/* <img src={image_1} className="absolute right-20 w-[500px]" /> */}
        <div className="absolute text-left">
          <p className="text-white font-semibold text-[14px] ml-16 mb-5">
            Own yourself, for everything
          </p>
          <h1 className="text-white font-semibold text-[35px] ml-14">
            중개자 없이 사용자들이 암호화폐 <br />
            레버리지 거래할 수 있는 플랫폼
          </h1>

          <div className="p-2 flex gap-7 justify-left ml-11 pt-7">
            <button
              onClick={() => navigate("/trade")}
              className="text-black text-[20px] hover:bg-purple-200 p-2 w-[230px] bg-white rounded-full mt-5"
            >
              거래하러 가기
            </button>
            <button
              onClick={() => navigate("/staking")}
              className="text-black text-[20px] hover:bg-purple-200 p-2 w-[230px] bg-white rounded-full mt-5"
            >
              유동성 추가하기
            </button>
          </div>
        </div>
      </>
      <div className="">
        <div className="absolute right-[300px]  top-1/4 transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md "
          >
            <img src={bitcoinImg} alt="bitcoinImg" className="w-7" />
            <p className="text-white">Bitcoin</p>
            <p className="text-[#5F6377]">BTC</p>
          </button>
          <img src={totem} />
        </div>
        <div className="absolute right-[120px] top-2/5 transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md "
          >
            <img src={tetherImg} alt="usdtImg" className="w-7" />
            <p className="text-white">Tether</p>
            <p className="text-[#5F6377]">USDT</p>
          </button>
          <img src={totem} />
        </div>
        <div className="absolute right-[500px] bottom-1/4 transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md"
          >
            <img src={ethImg} alt="ethImg" className="w-7" />
            <p className="text-white">Ethereum</p>
            <p className="text-[#5F6377]">ETH</p>
          </button>
          <img src={totem} alt="totem" />
        </div>
      </div>
    </section>
  );
};

export default Top;
