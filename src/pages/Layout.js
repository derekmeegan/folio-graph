import { Outlet, Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiagramProject,
  faSignInAlt,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import supabase from "../services/supabase";
import { useAuth } from "../components/AuthProvider";

const Layout = () => {
  const { user } = useAuth();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  };

  return (
    <>
      <Sidebar
        collapsed={true}
        breakPoint="md"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#1D1D1F",
          },
          height: "100vh",
          position: "fixed",
        }}>
        <Menu
          menuItemStyles={{
            button: {
              display: "flex",
              alignItems: "center",
              padding: "20px 20px",
              fontSize: "16px",
              color: "#5FE78F",
              textDecoration: "none",
              [`&.active`]: {
                backgroundColor: "#1D1D1F",
                color: "#b6c8d9",
              },
            },
          }}>
          <MenuItem
            icon={<FontAwesomeIcon icon={faDiagramProject} />}
            component={<Link to="/" />}>
            Home
          </MenuItem>
          {user ? (
            <MenuItem
              icon={<FontAwesomeIcon icon={faUser} />}
              component={<Link to="/account" />}>
              Account
            </MenuItem>
          ) : (
            <>
              <MenuItem
                icon={<FontAwesomeIcon icon={faSignInAlt} />}
                component={<Link to="/signin" />}>
                Sign In
              </MenuItem>
            </>
          )}
          {user && (
            <MenuItem
              icon={<FontAwesomeIcon icon={faSignOutAlt} />}
              onClick={signOut}>
              Logout
            </MenuItem>
          )}
        </Menu>
      </Sidebar>
      <div
        style={{
          marginLeft: "80px",
          // transition: "margin-left 0.3s",
        }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
