/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AdminLayout from "~/components/admin-layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <AdminLayout>
        <main className={inter.className}>
          <Toaster position="top-center" />
          <Component {...pageProps} />
        </main>
      </AdminLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
