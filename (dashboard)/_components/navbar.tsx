import React from "react";
import { NavbarRoutes } from "./navbar-routes";
import { MobileSideBar } from "./mobile-side-bar";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {/* mobile routes */}
      <MobileSideBar />

      {/* sidebar routes */}
      <NavbarRoutes />
    </div>
  );
};
