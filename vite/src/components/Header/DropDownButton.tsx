import {
    ComponentType,
    FC,
    MouseEvent,
    MouseEventHandler,
    useEffect,
    useState,
  } from "react";
  import { MdArrowDropDown } from "react-icons/md";
  import { useSelector } from "react-redux";
  import { RootState } from "../../app/store";
  
  interface DropDownButtonProps {
    text: string;
    MenuComponent: ComponentType;
    src?: string;
  }
  
  const DropDownButton: FC<DropDownButtonProps> = ({
    text,
    MenuComponent,
    src,
  }) => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const { onClickOutside } = useSelector((state: RootState) => state.events);
  
    useEffect(() => {
      setIsOpen(false);
    }, [onClickOutside]);
  
    const onClickButton = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    };
    return (
      <button
        className="relative flex justify-between items-center rounded-[4px] h-10 px-3 py-[6px] text-[#f0f0f0] text-[14px] font-semibold tracking-normal bg-[#3B3D59] hover:bg-[#373852] w-[160px]"
        onClick={onClickButton}
        onBlur={() => setIsOpen(false)}
      >
        <div className="flex">
          <div>{src && <img src={src} className="w-5 h-5 mr-2" />}</div>
          <div>{text}</div>
        </div>
        <MdArrowDropDown size={20} />
        {isOpen && <MenuComponent />}
      </button>
    );
  };
  
  export default DropDownButton;