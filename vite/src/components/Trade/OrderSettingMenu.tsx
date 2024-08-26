import { FC, useState } from "react";
import { MdSettings } from "react-icons/md";
import OrderSettingModal from "./OrderSettingModal";

const OrderSettingMenu: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative z-20">
        <button>
          <MdSettings size={18} onClick={openModal} />
        </button>
        <OrderSettingModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default OrderSettingMenu;
