import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      <button
        className="flex items-center cursor-pointer gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-500 hover:bg-gray-100 transition duration-300"
        onClick={() => navigate("/login")}
      >
        Login <img src={assets.arrow_icon} alt="Arrow icon" />
      </button>
    </div>
  );
};

export default Navbar;
