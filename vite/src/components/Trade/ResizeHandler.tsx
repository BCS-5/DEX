import { FC, useState } from "react";

interface ResizeHandlerParams {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResizeHandler: FC<ResizeHandlerParams> = ({ setHeight, setIsHover }) => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const resize = (e: any) => {
    if (!isMouseDown) return;
    console.log(window, e.screenY);

    setHeight(
      Math.min(Math.max(window.innerHeight - e.screenY + 40, 252), 500)
    );
    // console.log(e.screenY);
  };
  return (
    <div
      className={`
            ${
              isMouseDown ? "fixed top-0 left-0 h-full z-[100]" : "absolute h-4"
            }
             w-full bg-transparent cursor-n-resize
        `}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseMove={resize}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {" "}
    </div>
  );
};

export default ResizeHandler;
