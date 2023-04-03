import { FaBook, FaUserCog } from "react-icons/fa";
import DashboardItem, { DropDownDashboardItem } from "./dashboard-item";
import { useSession } from "next-auth/react";

const UserDashboard = () => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  return (
    <>
      {isLoggedIn ? (
        <DropDownDashboardItem
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
        </DropDownDashboardItem>
      ) : (
        <DashboardItem icon={FaBook} href="/ksiazki">
          Lista książek
        </DashboardItem>
      )}

      {isLoggedIn && (
        <DashboardItem icon={FaUserCog} href="/moje-dane">
          Moje dane
        </DashboardItem>
      )}
    </>
  );
};

export default UserDashboard;
