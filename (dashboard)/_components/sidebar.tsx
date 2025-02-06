import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white">
      <div className="p-6">
        <Logo />
      </div>

      {/* side bar routes */}
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
