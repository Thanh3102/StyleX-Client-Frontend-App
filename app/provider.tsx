"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <NextUIProvider locale="en-GB">{children}</NextUIProvider>
      </SessionProvider>
    </>
  );
}
