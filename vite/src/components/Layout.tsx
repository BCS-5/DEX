import { FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { onClickOutside } from "../features/events/eventsSlice";

const Layout: FC = () => {
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(onClickOutside());
  };

  return (
    <div onClick={onClickHandler}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;