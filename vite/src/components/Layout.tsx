import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
