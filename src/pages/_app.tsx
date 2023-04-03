/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import AdminLayout from "~/components/admin-layout";
import UserLayout from "~/components/user-layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const Layout =
    pageProps?.session?.data?.user?.role === "admin" ? AdminLayout : UserLayout;
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <main className={inter.className}>
          <Toaster position="top-center" />
          <Component {...pageProps} />
        </main>
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
