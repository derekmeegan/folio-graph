import { Outlet, Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

const Layout = () => {
  return (
    <>
      <Menu>
        <Link className="menu-item" to="/">
          Home
        </Link>
        <Link className="menu-item" to="/about">
          About
        </Link>
        <Link className="menu-item" to="/signin">
          Sign info
        </Link>
        {/* <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a> */}
      </Menu>

      <Outlet />
    </>
  );
};

export default Layout;
