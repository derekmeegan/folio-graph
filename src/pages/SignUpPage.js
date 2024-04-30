import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import { useAuth } from "../components/AuthProvider.js";
// import { PlaidLinkFunctional } from "./PlaidLinkFunctional";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { SignIn } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      //   const { user, error } = await supabase.auth.signUp({
      //     email: username,
      //     password: password,
      //   });

      const { error } = await signUp({ email: username, password: password });

      //   const { error2 } = await SignIn({ email: username, password: password });

      if (error) throw error;
      //   setSession(user);
      navigate("/addAssets"); // Navigate to link bank accounts after signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-80 pt-40">
      <form onSubmit={handleSignup}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* {user && <PlaidLinkFunctional user={user} />} */}
    </div>
  );
};

export default SignUpPage;
