import { FC } from "react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Market",
    path: "/Market",
  },
  {
    name: "Trade",
    path: "/Trade",
  },
  {
    name: "Portfolio",
    path: "/Portfolio",
  },
  {
    name: "Mint",
    path: "/Mint",
  },
  {
    name: "Staking",
    path: "/Staking",
  },
];

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-auto justify-between m-2">
      <div className="flex gap-8">
        <div>logo</div>
        <div className="flex gap-4">
          {navLinks.map((v, i) => (
            <button
              key={i}
              className="hover:underline"
              onClick={() => navigate(v.path)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Header;
