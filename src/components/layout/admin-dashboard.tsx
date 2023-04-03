import { FaBook, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import DashboardItem, { DropDownDashboardItem } from "./dashboard-item";
import { signOut } from "next-auth/react";

const AdminDashboard = () => {
  return (
    <>
      <DropDownDashboardItem
        icon={FaBook}
        dropDownItems={[
          { href: "/ksiazki", text: "Lista książek" },
          { href: "/ksiazki/dodaj", text: "Dodaj książke" },
        ]}
      >
        Książki
      </DropDownDashboardItem>
      <DropDownDashboardItem
        icon={FaUserAlt}
        dropDownItems={[
          { href: "/czytelnicy", text: "Lista czytelników" },
          { href: "/czytelnicy/dodaj", text: "Dodaj czytelnika" },
        ]}
      >
        Czytelnicy
      </DropDownDashboardItem>
      <DashboardItem icon={MdAdminPanelSettings} href="/moje-dane">
        Moje dane
      </DashboardItem>

      <DashboardItem
        icon={FaSignOutAlt}
        onClick={() => signOut({ callbackUrl: "/zaloguj" })}
      >
        Wyloguj
      </DashboardItem>
    </>
  );
};

export default AdminDashboard;
