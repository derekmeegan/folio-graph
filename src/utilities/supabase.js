import supabase from "../services/supabase";

const userExists = async (usernameOrEmail) => {
  try {
    let { data: users } = await supabase
      .from("profiles")
      .select("username")
      .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`);
    return users.length > 0;
  } catch (error) {
    console.error("Error checking user existence", error);
  }
};

export default userExists;
