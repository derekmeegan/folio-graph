import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../services/supabase";

const SignInPage = () => {
  return (
    <div className="p-80 pt-40">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        redirectTo="http://localhost:3000/"
      />
    </div>
  );
};

export default SignInPage;
