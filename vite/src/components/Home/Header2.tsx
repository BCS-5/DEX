import { useNavigate } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";

const Header2 = () => {
  const navigate = useNavigate();

  return (
    <div className="top-0 left-8 bg-black flex justify-between sticky z-10">
      <div className="flex">
        {/* <img src={Logo} alt="Logo" className="pl-11 w-[100px]" /> */}
        <div className="pt-3  text-white text-[25px] font-bold ">fiX</div>
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
