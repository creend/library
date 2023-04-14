import { FaBook, FaUserAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import DashboardItem, { DropDownDashboardItem } from "./dashboard-item";

const AdminDashboard = () => {
  return (
    <>
      <DropDownDashboardItem
        icon={FaBook}
        dropDownItems={[
          { href: "/ksiazki", text: "Lista książek" },
          { href: "/ksiazki/dodaj", text: "Dodaj książke" },
          { href: "/ksiazki/rezerwacje", text: "Zobacz rezerwacje" },
          { href: "/ksiazki/wypozyczenia", text: "Zobacz wypożyczenia" },
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
    </>
  );
};

export default AdminDashboard;
