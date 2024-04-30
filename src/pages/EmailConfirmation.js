import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

const EmailConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmSignUp = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token_hash");
      const type = params.get("type");

      if (type === "signup" && token) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type,
          });

          if (error) {
            throw error;
          }

          // Redirect user after successful confirmation
          navigate("/signin"); // Or to '/dashboard' if you want them to sign in first
        } catch (error) {
          console.error("Error confirming sign up:", error.message);
          // Optionally navigate to an error page or display an error message
        }
      }
    };

    confirmSignUp();
  }, [location, navigate]);

  return (
    <div>
      Confirming your email...
      {/* Render any loading indicators or messages you want here */}
    </div>
  );
};

export default EmailConfirmation;
