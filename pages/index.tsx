import type { NextPage } from "next";
import prisma from "../lib/prisma";

interface Props {
  users: any;
}

const Home: NextPage<Props> = ({ users }) => {
  return (
    <main>
      {users.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </main>
  );
};

export const getServerSideProps = async () => {
  const users = await prisma.user.findMany();

  return { props: { users } };
};

export default Home;
