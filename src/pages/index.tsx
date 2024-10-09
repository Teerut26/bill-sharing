import { type GetServerSidePropsContext } from "next";

export default function Index() {
  return <div>Index</div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/trip",
      permanent: false,
    },
  };
}
