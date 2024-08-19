import FAQItem from "./FAQItem";

const FAQList: React.FC = () => {
  const faqData = [
    {
      question: "선물 거래(Futures Trading)란?",
      answer:
        "암호화폐 선물 거래에서는 트레이더가 특정 암호화폐의 가격이 오를 것인지 내릴 것인지에 따라 롱(Long) 또는 숏(Short) 포지션을 취할 수 있습니다. 이로 인해, 자산을 실제로 보유하지 않아도 가격 변동에 따라 수익을 얻거나 손실을 입을 수 있습니다.",
    },
    {
      question: "롱/숏 포지션이란",
      answer:
        "롱(매수) 포지션을 취하면 자산 가격이 오를 때 수익을 얻고, 숏(매도) 포지션을 취하면 자산 가격이 내릴 때 수익을 얻습니다. ",
    },
    {
      question: "Virtual Token?",
      answer:
        "Virtual Token은 실제 자산 없이도 암호화폐의 가격 변동에 투자할 수 있는 디지털 자산을 의미합니다.",
    },
    {
      question: "AMM(Automated Market Maker : 자동화된 마켓 메이커)",
      answer:
        "AMM은 유동성 풀을 통해 자동으로 거래를 매칭하여 사용자 간의 거래를 중개하는 기술로, 탈중앙화 거래소에서 주로 사용됩니다.",
    },
    {
      question: "펀딩레이트",
      answer:
        "펀딩레이트는 선물거래에서 롱과 숏 포지션 간의 균형을 맞추기 위해 일정 시간마다 지불되는 수수료로, 시장의 수요와 공급에 따라 변동됩니다.",
    },
    {
      question: "거래하는 방법",
      answer:
        "상단에 Launch App 버튼을 클릭하며 거래페이지로 이동합니다. Wallet Connect를 클릭하여 사용자의 지갑 연결을 한 다음, ~~~~~~~~~~~",
    },
  ];

  return (
    <div className=" mx-auto my-8 pt-[60px] pb-[60px]">
      <div className="text-[25px] mb-4 font-bold text-center">
        자주 묻는 질문
      </div>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQList;
