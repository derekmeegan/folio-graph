import { Outlet, Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { React, useState } from "react";
import supabase from "../services/supabase";
import { useAuth } from "../components/AuthProvider";

const Layout = () => {
  const [isOpen, setOpen] = useState(false);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  };

  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  const { user } = useAuth();
  return (
    <>
      <Menu isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
        <Link className="menu-item" to="/" onClick={closeSideBar}>
          Home
        </Link>
        <Link className="menu-item" to="/about" onClick={closeSideBar}>
          About
        </Link>
        {user ? (
          <Link className="menu-item" to="/account" onClick={closeSideBar}>
            Account
          </Link>
        ) : (
          <>
            <Link className="menu-item" to="/signin" onClick={closeSideBar}>
              Sign In
            </Link>
          </>
        )}
        {!user && (
          <Link className="menu-item" to="/signup" onClick={closeSideBar}>
            Sign Up
          </Link>
        )}

        {user && <button onClick={signOut}>Logout</button>}
      </Menu>

      <Outlet />
    </>
  );
};

export default Layout;
