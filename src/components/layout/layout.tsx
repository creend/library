import { signOut, useSession } from "next-auth/react";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";
import { useState, type ReactNode } from "react";
import DashboardItem from "./dashboard-item";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Spinner from "../ui/spinner";

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const Dashboard =
    session.data?.user.role === "admin" ? AdminDashboard : UserDashboard;
  const isLoggedIn = session.status === "authenticated";

  const [isHamburgerMenuOpened, setIsHamnurgerMenuOpened] = useState(false);

  if (session.status === "loading")
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  return (
    <>
      <button
        data-collapse-toggle="navbar-hamburger"
        type="button"
        className={`fixed left-0 top-0 z-50 ml-3 inline-flex  items-center rounded-lg p-2 text-sm text-gray-400 transition-transform hover:bg-gray-700 focus:outline-none focus:ring-2  focus:ring-gray-600 lg:hidden `}
        aria-controls="navbar-hamburger"
        aria-expanded="false"
        onClick={() => setIsHamnurgerMenuOpened((prevState) => !prevState)}
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed left-0 top-0 z-40 h-screen w-full -translate-x-full transition-transform lg:w-64 ${
          isHamburgerMenuOpened ? "translate-x-0" : "lg:translate-x-0"
        } `}
        aria-label="Sidebar"
      >
        <div
          className={`h-full overflow-y-auto bg-gray-800 px-3 py-4 ${
            isHamburgerMenuOpened ? "pt-14" : ""
          } `}
        >
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
      <main className="lg:pl-64">{children}</main>
    </>
  );
};

export default Layout;
