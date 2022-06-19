import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const crumbs = router.asPath.split("/").slice(1);

  const { data: session, status } = useSession();

  return (
    <Flex width="100%" height="3rem" bgColor="black" align="center" px="1rem">
      <Breadcrumb textColor="white">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, i) => {
          // TODO: If part of route doesn't exist don't make it clickable or create it (eg. crags redirect to /)
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
        <Link href={`/users/${session.user.id}`}>
          <HStack spacing="0.5rem">
            <Avatar src={"/api/uploads/" + session.user.image} />

            <Text textColor="white">{session.user.name}</Text>
          </HStack>
        </Link>
      )}
    </Flex>
  );
};

export default Navbar;
