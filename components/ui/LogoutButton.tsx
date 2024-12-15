"use client";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/signin", redirect: true })}
      className="w-fit"
    >
      Logout
    </Button>
  );
};
export default LogoutButton;
