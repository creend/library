/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import Layout from "~/components/layout/layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
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
