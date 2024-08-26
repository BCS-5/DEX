import FAQItem from "./FAQItem";

const FAQList: React.FC = () => {
  const faqData = [
    {
      question: "What is the fiX?",
      answer: "ㅇㅇㅇㅇ ",
    },
    {
      question: "What is Futures Trading??",
      answer:
        "In cryptocurrency futures trading, traders can take a long or short position depending on whether they believe the price of a specific cryptocurrency will rise or fall. This allows them to profit or incur losses based on price fluctuations without actually holding the asset.",
    },
    {
      question: "Long/Short Position",
      answer:
        "When taking a long (buy) position, you profit when the asset price rises, and when taking a short (sell) position, you profit when the asset price falls. ",
    },
    {
      question: "Virtual Token?",
      answer:
        "Virtual Token refers to a digital asset that allows you to invest in cryptocurrency price fluctuations without owning the actual asset.",
    },
    {
      question: "AMM(Automated Market Maker)",
      answer:
        "AMM is a technology that automatically matches trades through liquidity pools, facilitating transactions between users. It is primarily used in decentralized exchanges.",
    },
    {
      question: "Funding Rate",
      answer:
        "Funding rate is a fee paid periodically in futures trading to balance long and short positions, and it fluctuates based on market supply and demand.",
    },
    {
      question: "How to trade (market price)",
      answer:
        "Click the Launch App or Go to Trade button at the top to navigate to the trading page. Click Connect Wallet to connect your wallet, then click the Deposit button at the bottom right. In the Deposit amount field, enter the amount of USDT you wish to deposit, and click Deposit Once the transaction is complete, click the Trade tab at the top to proceed, where you can view your deposited USDT Available. In the Collateral field, enter the amount of USDT you want to use from your deposited amount. Set the leverage below, then click the Open Long/Short button to complete the trade.",
    },
  ];

  return (
    <div className=" mx-auto my-8 pt-[60px] pb-[60px]">
      <div className="text-[25px] mb-4 font-bold text-center">FAQ</div>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQList;
