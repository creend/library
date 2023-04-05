import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const ReadersPage = () => {
  const { data: readers, isLoading } = api.readers.getReaders.useQuery();
  console.log(readers);
  return (
    <>
      <Head>
        <title>Czytelnicy</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-2xl font-semibold text-slate-200">
        Lista czytelników
      </h1>
    </>
  );
};

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
  await ssg.readers.getReaders.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ReadersPage;
