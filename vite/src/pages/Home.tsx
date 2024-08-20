// import { FC } from "react";
// import ProviderSetup from "../components/ProviderSetup";
// import UseProvider from "../components/UseProvider";
// import bg_img from "../img/home.png";

// const App: FC = () => {
//   return (
//     <>
//       <div className="bg-red-100">
//         <ProviderSetup />
//         <UseProvider />
//       </div>
//       <section
//         className="relative flex items-center justify-center bg-cover bg-center h-screen"
//         style={{ backgroundImage: `url(${bg_img})` }}
//       >
//         <div className="absolute text-center">
//           <h1 className="text-white font-semibold text-[80px]">거래소이름</h1>
//           <h2 className="text-white text-[40px]">
//             탈중앙화 선물 거래소 <br /> ㅇㅇㅇ소개페이지 한문장요약 또는
//             슬로건ㅇㅇㅇ
//           </h2>
//           <div className="p-2 flex gap-7 justify-center">
//             <button className="text-black text-[25px] hover:bg-purple-200 p-2 px-10 bg-white rounded-xl mt-5">
//               거래하러 가기
//             </button>
//             <button className="text-black text-[25px] hover:bg-purple-200 p-2 px-10 bg-white rounded-xl mt-5">
//               유동성 추가하기
//             </button>
//           </div>
//         </div>
//       </section>
//       <section>
//         <div>ㅇㅇㅇ설명ㅇㅇㅇ</div>
//         <p>
//           ddddddd은 누구나 암호화폐에 레버리지 노출을 할 수 있도록 합니다.
//           우리는 진정으로 분산화되고 비보관형인 궁극의 온체인 거래 경험을
//           개척하고 있습니다. dddddd에서 깊은 유동성을 갖춘 빠르고 허가 없는 영구
//           스왑 DEX의 스릴을 발견하세요.랑 같은 유형의 거래소 간단 설명
//         </p>
//         <div>ㅇㅇㅇ기능? 장점?ㅇㅇㅇ</div>
//         <div>ㅇㅇㅇ작동방식 설명(순서도처럼?)ㅇㅇㅇ</div>
//         <div>
//           ㅇㅇㅇ용어 설명(토글)ㅇㅇㅇ
//           <div>선물거래</div>
//           <div>Virtual Token</div>
//           <div>등</div>
//           <div>등등</div>
//           <div>등등등</div>
//           <div>등등등등</div>
//         </div>
//       </section>
//       <footer className="text-white bg-black">footer</footer>
//     </>
//   );
// };

// export default App;

import { FC } from "react";
// import ProviderSetup from "../components/ProviderSetup";
// import UseProvider from "../components/UseProvider";
import bg_img from "../img/home.png";
import page_1 from "../img/page_1.png";
import page_2 from "../img/page_2.png";
import image_1 from "../img/image_1.png";
import pair from "../img/pair.png";
import price from "../img/price.png";
import bg from "../img/bg.jpeg";
import { useNavigate } from "react-router-dom";
import CardSection from "../components/Home/CardSection";

const App: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-red-100">
        {/* <ProviderSetup />
        <UseProvider /> */}
      </div>
      <section
        className="relative flex items-center justify-left bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute text-white top-0 left-8  m-7">
          거래소 로고위치
        </div>
        <>
          <img src={image_1} className="absolute right-20 w-[500px]" />
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
        </>
      </section>
      <section className=" justify-center px-80 pt-14">
        <>
          <h3 className="text-[25px] mb-4">Own yourself, for everything</h3>
          <p className="text-[18px]">
            ㅇㅇㅇㅇ는 누구나 간편하게 암호화폐 선물 거래에 참여할 수 있는
            플랫폼을 제공합니다. 사용자의 자산을 안전하게 보호하는 비보관형
            구조와 함께, 스마트 계약 기반의 빠르고 투명한 거래를 지원합니다.
            무제한의 유동성과 레버리지를 통해 최적의 온체인 거래 경험을
            선사합니다.
          </p>
        </>
        <br />
        <br />
        <>
          <div className="text-[25px] mb-4">장점</div>
          <CardSection />
        </>
        <br />
        <div className="text-[25px] mb-4">설명</div>
        <br />
        <>
          <div className="text-[25px] mb-4">용어 설명(토글)</div>
          <div>선물거래</div>
          <div>Virtual Token</div>
          <div>등</div>
          <div>등등</div>
          <div>등등등</div>
          <div>등등등등</div>
        </>
      </section>
      <footer className="text-white bg-black">footer</footer>
    </>
  );
};

export default App;