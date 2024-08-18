import { useNavigate } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";

const Header2 = () => {
  const navigate = useNavigate();

  return (
    <div className="top-0 left-8 bg-green-200 flex justify-between sticky">
      <div className="p-8 pl-[66px] ">거래소 로고위치</div>
      <div className="p-5 pr-[66px] transition-transform duration-300 ease-in-out hover:-translate-x-1">
        <button
          onClick={() => navigate("/trade")}
          className="p-3 px-11 flex items-center gap-1 font-bold rounded-full bg-purple-100 transition-transform duration-300 ease-in-out hover:bg-purple-200"
        >
          <span className="">Launch App</span>
          <PiArrowUpRight className="text-[24px] mt-1" />
        </button>
      </div>
    </div>
  );
};

export default Header2;
