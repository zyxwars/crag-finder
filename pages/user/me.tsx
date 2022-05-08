import { withIronSessionSsr } from "iron-session/next";
import { NextPageContext } from "next";
import React from "react";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import prisma from "../../lib/prisma";
import { redirectSsr } from "../../lib/redirectSsr";
import { sessionOptions } from "../../lib/session";

const Me = () => {
  return <div>Me</div>;
};

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const session = await withAuthSsr(req);

  if (!session) {
    return redirectSsr(res, "/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return { props: {} };
}, sessionOptions);
export default Me;
