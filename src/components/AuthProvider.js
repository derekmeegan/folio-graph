import { createContext, useState, useEffect, useContext } from "react";
import supabase from "../services/supabase";

const AuthContext = createContext({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("session onAuthStateChange: ", session);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // In case we want to manually trigger a signIn (instead of using Auth UI)
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { skipBrowserRedirect: false },
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error: ", error);
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  const signUp = async ({ username, password }) => {
    const { user, error } = await supabase.auth.signUp({
      email: username,
      password: password,
    });
    console.log("the user below is the user");
    console.log(user);
    return { user, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signUp: (data) => supabase.auth.signUp(data),
      }}>
      {!loading ? children : `<div>Loading...</div>`}
    </AuthContext.Provider>
  );
};

export default AuthProvider;