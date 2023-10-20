import React from "react";
import { Outlet } from "react-router-dom";
import SideBarPro from "./SidebarPro/SidebarPro";
import "./layout.css";
import Navbaruser from "../Navbar/Navbaruser";
function Layout() {
  return (
    <>
      <div
        className="layoutMain"
        style={{
          padding: "50px 0px 0px 380px",
          backgroundColor: "#f4f7fa",
          backgroundRepeat: "repeat",
          height: "100vh",
        }}
      >
        <SideBarPro />

        <Outlet />
      </div>
    </>
  );
}

export default Layout;
