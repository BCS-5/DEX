import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="border-b-2">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center py-4 px-6 text-left"
      >
        <span className="font-bold">{question}</span>
        <span className="text-yellow-500 font-bold text-[25px]  ">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
