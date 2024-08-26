import { FC} from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { onClickOutside } from "../features/events/eventsSlice";
import UpdateOrderHistory from "./UpdateOrderHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout: FC = () => {
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(onClickOutside());
  };

  return (
    <div onClick={onClickHandler}>
      <Header />
      <Outlet />
      <UpdateOrderHistory />
      <ToastContainer />
    </div>
  );
};

export default Layout;
