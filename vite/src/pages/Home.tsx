import { FC } from "react";
import bg from "../img/bg.jpeg";
import image_1 from "../img/image_1.png";
import CardSection from "../components/Home/CardSection";
import { useNavigate } from "react-router-dom";

const App: FC = () => {
  const navigate = useNavigate(); // useNavigate()를 사용하여 navigate를 정의합니다.

  return (
    <>
      <section
        className="relative flex items-center justify-left bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute text-white top-0 left-8 m-7">
          거래소 로고위치
        </div>
        <div className="absolute">
          <img src={image_1} className="absolute right-20 w-[500px]" alt="Decorative" />
          <div className="absolute text-left">
            <p className="text-white font-semibold text-[14px] ml-16 mb-5">
              Own yourself, for everything
            </p>
            <h1 className="text-white font-semibold text-[35px] ml-14">
              중개자 없이 사용자들이 암호화폐 <br />
              레버리지 거래할 수 있는 플랫폼
            </h1>
            <h3 className="text-white text-[20px] ml-14 mt-7">
              ㅁㄴㅁㄴㅁㄴㅁㄴㅁㄴ ㅁㄴㅁㄴㅁㄴㅁㄴㅁㄴ ㅁㄴㅁㄴㅁㄴㅁㄴㅁㄴ
            </h3>
            <div className="p-2 flex gap-7 justify-left ml-11">
              <button
                onClick={() => navigate("/trade")}
                className="text-black text-[20px] hover:bg-purple-200 p-2 px-10 w-[230px] bg-white rounded-2xl mt-5"
              >
                거래하러 가기
              </button>
              <button
                onClick={() => navigate("/staking")}
                className="text-black text-[20px] hover:bg-purple-200 p-2 px-10 w-[230px] bg-white rounded-2xl mt-5"
              >
                유동성 추가하기
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="justify-center px-80 pt-14">
        <h3 className="text-[25px] mb-4">Own yourself, for everything</h3>
        <p className="text-[18px]">
          ㅇㅇㅇㅇ는 누구나 간편하게 암호화폐 선물 거래에 참여할 수 있는
          플랫폼을 제공합니다. 사용자의 자산을 안전하게 보호하는 비보관형
          구조와 함께, 스마트 계약 기반의 빠르고 투명한 거래를 지원합니다.
          무제한의 유동성과 레버리지를 통해 최적의 온체인 거래 경험을
          선사합니다.
        </p>
        <br />
        <div className="text-[25px] mb-4">장점</div>
        <CardSection />
        <br />
        <div className="text-[25px] mb-4">설명</div>
        <br />
        <div className="text-[25px] mb-4">용어 설명(토글)</div>
        <div>선물거래</div>
        <div>Virtual Token</div>
        <div>등</div>
        <div>등등</div>
        <div>등등등</div>
        <div>등등등등</div>
      </section>
      <footer className="text-white bg-black">footer</footer>
    </>
  );
};

export default App;