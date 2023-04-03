import { useSession } from "next-auth/react";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";
import { type ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const Dashboard =
    session.data?.user.role === "admin" ? AdminDashboard : UserDashboard;
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-800 px-3 py-4">
          <ul className="space-y-2 font-medium">
            <Dashboard />
          </ul>
        </div>
      </aside>
      <main className="pl-64">{children}</main>
    </>
  );
};

export default Layout;
