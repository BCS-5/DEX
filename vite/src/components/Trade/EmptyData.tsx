import { FC } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";

interface EmptyDataParams {
  menu: string;
}

const EmptyData: FC<EmptyDataParams> = ({ menu }) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div>
          <AiOutlineFileSearch size={64} />
        </div>
        <span>No {menu} Data</span>
      </div>
    </div>
  );
};

export default EmptyData;
