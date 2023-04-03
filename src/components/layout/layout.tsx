import { useSession } from "next-auth/react";
import AdminLayout from "./admin-layout";
import UserLayout from "./user-layout";
import { type ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const Layout = session.data?.user.role === "admin" ? AdminLayout : UserLayout;
  return <Layout>{children}</Layout>;
};

export default Layout;
