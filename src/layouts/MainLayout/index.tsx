import { Outlet } from "react-router-dom";
import { Sidebar } from "./ui/Sidebar";
import { Topbar } from "./ui/Topbar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full flex-1 px-4 py-5 sm:px-6 sm:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
