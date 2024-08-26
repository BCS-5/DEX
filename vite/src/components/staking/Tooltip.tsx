import React, { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 w-64">
          <div className="relative p-3 bg-gray-800 text-white text-xs font-normal rounded-lg shadow-[0px_0px_50px_8px_rgba(0,0,0,0.5)] shadow-[#FED3FF]/40 z-10">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
