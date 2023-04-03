import { FaBook, FaSignOutAlt, FaSignInAlt, FaUserCog } from "react-icons/fa";
import NavItem, { DropDownNavItem } from "../nav-item";
import { signOut, useSession } from "next-auth/react";

const UserDashboard = () => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  return (
    <>
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
    </>
  );
};

export default UserDashboard;
