import { FaBook, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import NavItem, { DropDownNavItem } from "../nav-item";
import { signOut } from "next-auth/react";

const AdminDashboard = () => {
  return (
    <>
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
    </>
  );
};

export default AdminDashboard;
