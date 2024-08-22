import { VscGithub } from "react-icons/vsc";

const Footer = () => {
  return (
    <section className="max-w-[1080px] mx-auto flex justify-between pt-[50px] pb-[75px] px-40">
      <div className="pt-2 text-[14px]">Copyright © 2024 ㅇㅇㅇㅇ</div>
      <div className="pt-2 text-[14px] pr-[100px]"> 로고</div>
      <button className=" text-[25px]">
        <a href="https://github.com/BCS-5/DEX">
          <VscGithub />
        </a>
      </button>
    </section>
  );
};

export default Footer;
