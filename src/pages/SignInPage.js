import { useAuth } from "../components/AuthProvider.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { error } = await signIn({
        email: email,
        password: password,
      });

      if (error) throw error;
      navigate("/");
    } catch (error) {
      setError("Sign-in failed. Please check your credentials and try again.");
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #5FE78F, #4ABF78)" }}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden lg:max-w-lg w-full md:flex">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F] mb-4"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F] mb-4"
            />
            <button
              type="submit"
              className="w-full bg-[#1D1D1F] text-white py-2 rounded-lg hover:bg-[#4CAC6F] focus:outline-none focus:ring-2 focus:ring-[#5FE78F] mb-2">
              Sign In
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div>
              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{ color: "#5FE78F", textDecoration: "underline" }}>
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
