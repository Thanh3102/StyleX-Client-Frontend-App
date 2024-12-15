import { REFRESH_TOKEN_ROUTE, SIGN_IN_URL } from "@/util/constaint/api-routes";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Nhập email",
        },
        password: {
          label: "Mật khẩu",
          type: "password",
          placeholder: "Nhập mật khẩu",
        },
      },
      async authorize(credentials) {
        const response = await fetch(SIGN_IN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            terminate: false,
            ...data,
          };
        } else {
          const res = await response.json();
          throw new Error(res.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("[NextAuth] JWT Callback");
      // console.log("[NextAuth] JWT Token Access", token.accessToken);

      if (user) {
        // console.log("[NextAuth] JWT User", user);
        return { ...token, ...user };
      }

      if (new Date().getTime() > token.expiredIn) {
        // console.log("[NextAuth] Token expired");
        const newToken = await refreshToken(token);
        return newToken;
      }

      return token;
    },
    async session({ session, token }) {
      // console.log("[NextAuth-Session] Session", session);
      // console.log("[NextAuth-Session] Token", token);
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiredIn = token.expiredIn;
      session.terminate = token.terminate;
      // if (!session.terminate) {
      //   return session;
      // }
      return session;
    },
  },
};

async function refreshToken(token: JWT) {
  const response = await fetch(REFRESH_TOKEN_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }),
  });

  if (response.ok) {
    const data = await response.json();

    // console.log("[NextAuth-Refresh] New access token", data.accessToken);
    // console.log("[NextAuth-Refresh] New expire time", data.expiredIn);

    return {
      ...token,
      accessToken: data.accessToken,
      expiredIn: data.expiredIn,
    };
  }
  return {
    ...token,
    terminate: true,
  };
}
