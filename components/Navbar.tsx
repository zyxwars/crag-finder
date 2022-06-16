import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const crumbs = router.asPath.split("/").slice(1);

  const { data: session, status } = useSession();

  return (
    <Flex width="100%" height="3rem" bgColor="black" align="center">
      <Breadcrumb textColor="white">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, i) => {
          // TODO: If part of route doesn't exist don't make it clickable or create it (eg. crags)
          return (
            <BreadcrumbItem key={i}>
              <BreadcrumbLink
                href={"/" + crumbs.slice(0, i + 1).join("/")}
                className={styles.capitalize}
              >
                {crumb}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>

      <Spacer />

      {session && (
        <>
          <Image
            src={"/api/uploads/" + session.user.image}
            alt="avatar"
            width="50px"
            height="50px"
          />
          <Text textColor="white">{session.user.name}</Text>
        </>
      )}
    </Flex>
  );
};

export default Navbar;
