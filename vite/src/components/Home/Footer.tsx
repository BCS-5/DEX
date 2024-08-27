import { VscGithub } from "react-icons/vsc";
// import FooterImg from "./img/logo/footerImg.png";

const Footer = () => {
  return (
    <section className="max-w-[1080px] mx-auto flex justify-between pt-[50px] pb-[75px] px-40 ">
      <div className="pt-5 text-[14px] text-white">Copyright © 2024 fiX</div>
      <div className=" text-[14px] pr-[100px]">
        {/* <img src={FooterImg} alt="Logo" className="w-11" /> */}
      </div>
      <button className=" text-[25px] pt-3 text-white">
        <a href="https://github.com/BCS-5/DEX">
          <VscGithub />
        </a>
      </button>
    </section>
  );
};

export default Footer;
