import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import Navbar from "./Navbar";

function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
export default Layout;
