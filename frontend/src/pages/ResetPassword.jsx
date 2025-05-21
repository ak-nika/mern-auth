import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";

const ResetPassword = () => {
  const inputRefs = React.useRef([]);

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
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

  const handleEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await axios.post(`${backendUrl}/api/auth/sendResetOtp`, {
        email,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEmailSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const otp = inputRefs.current.map((e) => e.value).join("");

      setOtp(otp);
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/auth/resetPassword`,
        { email, otp, newPassword }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEmailSent(false);
        setIsOtpSubmitted(false);
        setEmail("");
        setNewPassword("");
        setOtp("");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="fixed left-5 sm:left-20 top-5 w-28 sm:w-32"
        />
      </Link>

      {/* email form */}
      {!isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleEmailSubmit}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center text-indigo-400 mb-6">
            Please enter your registered email address to reset your password
          </p>

          <label className="block ml-2 mb-2 text-white text-sm" htmlFor="email">
            Email
          </label>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} alt="Mail Icon" className="w-3 h-3" />
            <input
              type="email"
              placeholder="johndoe@example.com"
              required
              className="outline-none text-white"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3 ${
              isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* otp form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleOtpSubmit}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
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
      )}

      {/* new password form */}
      {isOtpSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleNewPasswordSubmit}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center text-indigo-400 mb-6">
            Please enter your new password
          </p>

          <label
            className="block ml-2 mb-2 text-white text-sm"
            htmlFor="new-password"
          >
            New Password
          </label>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} alt="Lock Icon" className="w-3 h-3" />
            <input
              type="password"
              placeholder="JohnDoe@123"
              required
              className="outline-none text-white"
              id="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3 ${
              isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
