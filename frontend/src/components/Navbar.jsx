import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const logout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/sendVerificationOtp`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/verifyEmail");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-slate-900 relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isVerified && (
                <li
                  className="py-1 px-2 cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                  onClick={sendVerificationOtp}
                >
                  Verify email
                </li>
              )}
              <li
                className="py-1 px-2 cursor-pointer hover:bg-gray-200 transition-colors duration-300 pr-10"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center cursor-pointer gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-500 hover:bg-gray-100 transition duration-300"
          onClick={() => navigate("/login")}
        >
          Login <img src={assets.arrow_icon} alt="Arrow icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
