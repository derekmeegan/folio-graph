import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import debounce from "lodash.debounce";
import { useAuth } from "../components/AuthProvider.js";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const checkUsernameAvailability = useCallback(
    () =>
      (debounce(async (username) => {
        if (username.length < 3) {
          setIsUsernameAvailable(true);
          return;
        }
        try {
          let { data: users } = await supabase
            .from("profiles")
            .select("username")
            .like("username", `${username}%`);

          const usernameDoesNotExist =
            users
              .map((user) => user.username)
              .filter((name) => username === name).length === 0;
          setIsUsernameAvailable(usernameDoesNotExist);
        } catch (error) {
          console.error("Error checking username availability", error);
          setIsUsernameAvailable(true);
        }
      }),
      500)(), // This IIFE returns the debounced function
    []
  );

  const handleRandomUsername = () => {
    const randomUsername = "user" + Math.floor(Math.random() * 10000); // Simple random username logic
    setUsername(randomUsername);
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    checkUsernameAvailability(newUsername);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isUsernameAvailable) {
      setError("You must change your username before signing up.");
      return;
    }

    if (!email) {
      setError("Email is required.");
    }

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!passwordsMatch) {
      setError("Your passwords must match before signing up.");
      return;
    }
    try {
      const { error } = await signUp({
        email: email,
        password: password,
        username: username,
      });

      console.log(error);

      if (error) throw error;
      navigate("/addAssets");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #5FE78F, #0A6136)" }}
    >
      <div className="bg-white shadow-md rounded-lg overflow-hidden lg:max-w-lg w-full md:flex">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center">Welcome</h2>
          <p className="text-center text-gray-600 text-sm mt-2 mb-4">
            Welcome to Folio Social! Please fill out the form below to create
            your account. Looking forward to seeing you on the graph!
          </p>
          <form onSubmit={handleSignup}>
            <div className="flex flex-row">
              <div className="w-2/3">
                <input
                  type="text"
                  placeholder="Username"
                  onChange={handleUsernameChange}
                  value={username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomUsername}
                className="ml-2 px-4 py-2 bg-[#5FE78F] text-xs text-white rounded-lg hover:bg-[#4CAC6F] focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
              >
                Random Username
              </button>
            </div>
            <div className="mb-4">
              {!isUsernameAvailable && (
                <p className="text-red-600 text-sm mt-1">
                  Username is already taken
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                // onChange={(e) => setPassword(e.target.value)}
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
              />
              {!passwordsMatch && (
                <p className="text-red-600 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-purple accent-[#1D1D1F] checked:bg-[#5FE78F] checked:border-transparent focus:ring-2 focus:ring-[#5FE78F]"
                />
                <span className="ml-2 text-gray-600 text-sm">
                  I accept the{" "}
                  <a
                    href="#"
                    className="hover:underline"
                    style={{ color: "#5FE78F" }}
                  >
                    Terms of Use
                  </a>{" "}
                  &{" "}
                  <a
                    href="#"
                    className="hover:underline"
                    style={{ color: "#5FE78F" }}
                  >
                    {" "}
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D1D1F] text-white py-2 rounded-lg hover:bg-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#5FE78F]"
            >
              Register Now
            </button>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
