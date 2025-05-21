import React, { useContext, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (authMode === "signup") {
        const response = await axios.post(
          `${backendUrl}/api/auth/register`,
          {
            name,
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${backendUrl}/api/auth/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.status >= 200 && response.status < 300) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="fixed left-5 sm:left-20 top-5 w-28 sm:w-32"
        />
      </Link>

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {authMode === "signup"
            ? "Create your account"
            : "Login to your account"}
        </h2>

        <p className="text-center mb-6">
          {authMode === "signup"
            ? "Please fill in the details to create an account."
            : "Please enter your credentials to login."}
        </p>

        <form onSubmit={handleSubmit}>
          {authMode === "signup" && (
            <>
              <label
                className="block ml-2 mb-2 text-white text-sm"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
                <img src={assets.person_icon} alt="Person Icon" />
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  className="outline-none"
                  id="fullName"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </>
          )}

          <label className="block ml-2 mb-2 text-white text-sm" htmlFor="email">
            Email
          </label>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              type="email"
              placeholder="johndoe@example.com"
              required
              className="outline-none"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <label
            className="block ml-2 mb-2 text-white text-sm"
            htmlFor="password"
          >
            Password
          </label>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type="password"
              placeholder="JohnDoe@123"
              required
              className="outline-none"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <Link
            to="/resetPassword"
            className="block mb-4 text-indigo-500 text-center"
          >
            Forgot Password?
          </Link>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {authMode === "signup" ? "Sign Up" : "Login"}
          </button>

          {authMode === "signup" ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setAuthMode("login")}
                className="text-blue-400 underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => setAuthMode("signup")}
                className="text-blue-400 underline cursor-pointer"
              >
                Sign Up here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
