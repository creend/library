import { type ReactNode } from "react";
import { FaBook, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import NavItem, { DropDownNavItem } from "../nav-item";
import { signOut } from "next-auth/react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
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
                { href: "/ksiazki", text: "Lista książek" },
                { href: "/ksiazki/dodaj", text: "Dodaj książke" },
              ]}
            >
              Książki
            </DropDownNavItem>
            <DropDownNavItem
              icon={FaUserAlt}
              dropDownItems={[
                { href: "/czytelnicy", text: "Lista czytelników" },
                { href: "/czytelnicy/dodaj", text: "Dodaj czytelnika" },
              ]}
            >
              Czytelnicy
            </DropDownNavItem>
            <NavItem icon={MdAdminPanelSettings} href="/moje-dane">
              Moje dane
            </NavItem>

            <NavItem
              icon={FaSignOutAlt}
              onClick={() => signOut({ callbackUrl: "/zaloguj" })}
            >
              Wyloguj
            </NavItem>
          </ul>
        </div>
      </aside>
      <main className="pl-64">{children}</main>
    </>
  );
};

export default AdminLayout;
