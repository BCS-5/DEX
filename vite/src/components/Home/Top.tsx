import { useNavigate } from "react-router-dom";
import bg_img from "../Home/img/home.png";
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
          <p className="text-white font-semibold text-[16px] ml-16 mb-5">
            Own yourself, for everything
          </p>
          <h1 className="text-white font-semibold text-[35px] ml-14">
            중개자 없이 사용자들이 암호화폐 <br />
            레버리지 거래할 수 있는 플랫폼
          </h1>

          <div className="p-2 flex gap-7 justify-left ml-11 pt-7">
            <button
              onClick={() => navigate("/trade")}
              className="text-white border-2 text-[20px] hover:bg-gray-700 p-2 w-[230px] bg-black rounded-full mt-5"
            >
              거래하러 가기
            </button>
            <button
              onClick={() => navigate("/staking")}
              className="text-white border-2 text-[20px] hover:bg-gray-700 p-2 w-[230px] bg-black rounded-full mt-5"
            >
              유동성 추가하기
            </button>
          </div>
        </div>
      </>

      <>
        <div className="absolute right-[345px] top-[160px] transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md relative overflow-visible"
          >
            <img
              src={bitcoinImg}
              alt="bitcoin"
              className="w-10 absolute left-[-18px] top-1/2 transform -translate-y-1/2"
            />
            <p className="text-white ml-5">Bitcoin</p>
            <p className="text-[#5F6377]">BTC</p>
          </button>
          <img src={totem} />
        </div>

        <div className="absolute right-[126px] top-[358px] transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md relative overflow-visible"
          >
            <img
              src={tetherImg}
              alt="usdt"
              className="w-10 absolute left-[-19px] top-1/2 transform -translate-y-1/2"
            />
            <p className="text-white ml-5">Tether</p>
            <p className="text-[#5F6377]">USDT</p>
          </button>
          <img src={totem} />
        </div>

        <div className="absolute right-[500px] bottom-[120px] transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center">
          <button
            onClick={() => navigate("/trade")}
            className="bg-[rgba(0.1,0.1,0.1,0.85)] flex gap-1 font-semibold text-[20px] py-4 px-3 rounded-md  relative overflow-visible"
          >
            <img
              src={ethImg}
              alt="eth"
              className="w-10 absolute left-[-18px] top-1/2 transform -translate-y-1/2 border-2 bg-white rounded-full"
            />
            <p className="text-white ml-5">Ethereum</p>
            <p className="text-[#5F6377]">ETH</p>
          </button>
          <img src={totem} />
        </div>
      </>
    </section>
  );
};

export default Top;
