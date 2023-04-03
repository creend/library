import { type ReactNode } from "react";
import { FaBook, FaUserAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import NavItem, { DropDownNavItem } from "./nav-item";
import { signOut, signIn, useSession } from "next-auth/react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-800 px-3 py-4">
          <ul className="space-y-2 font-medium">
            <DropDownNavItem
              icon={FaBook}
              dropDownItems={[
                { href: "#", text: "Lista książek" },
                { href: "#", text: "Zarezerwowane książki" },
                { href: "#", text: "Wypożyczone książki" },
              ]}
            >
              Książki
            </DropDownNavItem>
            <NavItem icon={FaUserAlt} href="#">
              Moje dane
            </NavItem>
            {isLoggedIn ? (
              <NavItem icon={FaSignOutAlt} onClick={() => signOut()}>
                Wyloguj
              </NavItem>
            ) : (
              <NavItem icon={FaSignInAlt} href="/zaloguj">
                Zaloguj
              </NavItem>
            )}
          </ul>
        </div>
      </aside>
      <main className="pl-64">{children}</main>
    </>
  );
};

export default UserLayout;
