import { type ReactNode } from "react";
import { FaBook, FaSignOutAlt, FaSignInAlt, FaUserCog } from "react-icons/fa";
import NavItem, { DropDownNavItem } from "../nav-item";
import { signOut, useSession } from "next-auth/react";

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
            {isLoggedIn ? (
              <DropDownNavItem
                icon={FaBook}
                dropDownItems={[
                  { href: "/ksiazki", text: "Lista książek" },
                  {
                    href: "/ksiazki/zarezerwowane",
                    text: "Zarezerwowane książki",
                  },
                  { href: "/ksiazki/wypozyczone", text: "Wypożyczone książki" },
                ]}
              >
                Książki
              </DropDownNavItem>
            ) : (
              <NavItem icon={FaBook} href="/ksiazki">
                Lista książek
              </NavItem>
            )}

            {isLoggedIn && (
              <NavItem icon={FaUserCog} href="/moje-dane">
                Moje dane
              </NavItem>
            )}

            {isLoggedIn ? (
              <NavItem
                icon={FaSignOutAlt}
                onClick={() => signOut({ callbackUrl: "/zaloguj" })}
              >
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
