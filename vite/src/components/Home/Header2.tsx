import { useNavigate } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";
import Logo from "./img/logo/t_logo15.png";

const Header2 = () => {
  const navigate = useNavigate();

  return (
    <div className="top-0 left-8 bg-[#b885df] flex justify-between sticky z-50">
      <div className="flex">
        <img src={Logo} alt="Logo" className="pl-11  w-[120px] h-[75px] " />
        <div className="pt-4   text-white text-[25px] font-semibold ">fiX</div>
      </div>
      <div className="pt-2 pb-2 pr-[66px] transition-transform duration-300 ease-in-out hover:-translate-x-1">
        <button
          onClick={() => navigate("/trade")}
          className="p-2 px-11 flex items-center gap-1 font-bold rounded-full bg-black  hover:bg-gray-700 border-2 text-white"
        >
          <span>Launch App</span>
          <PiArrowUpRight className="text-[24px] mt-1" />
        </button>
      </div>
    </div>
  );
};

export default Header2;
