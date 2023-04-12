import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";
import { type ReactNode } from "react";
import DashboardItem from "./dashboard-item";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Spinner from "../spinner";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const { push } = useRouter();
  const Dashboard =
    session.data?.user.role === "admin" ? AdminDashboard : UserDashboard;
  const isLoggedIn = session.status === "authenticated";

  if (session.status === "loading")
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        // className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        className="fixed left-0 top-0 z-40 h-screen w-64"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-800 px-3 py-4">
          <ul className="space-y-2 font-medium">
            <Dashboard />
            {isLoggedIn ? (
              <DashboardItem
                icon={FaSignOutAlt}
                onClick={() => {
                  void signOut({ callbackUrl: "/zaloguj" });
                  toast.success("Wylogowano !");
                }}
              >
                Wyloguj
              </DashboardItem>
            ) : (
              <DashboardItem icon={FaSignInAlt} href="/zaloguj">
                Zaloguj
              </DashboardItem>
            )}
          </ul>
        </div>
      </aside>
      <main className="pl-64">{children}</main>
    </>
  );
};

export default Layout;
