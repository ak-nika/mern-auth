import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";

const EmailVerify = () => {
  const inputRefs = React.useRef([]);
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const otp = inputRefs.current.map((e) => e.value).join("");

      const response = await axios.post(
        `${backendUrl}/api/auth/verifyEmail`,
        { otp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="fixed left-5 sm:left-20 top-5 w-28 sm:w-32"
        />
      </Link>

      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verification OTP
        </h1>
        <p className="text-center text-indigo-400 mb-6">
          Please enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                required
                className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md outline-none"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          disabled={isLoading}
          className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full ${
            isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
