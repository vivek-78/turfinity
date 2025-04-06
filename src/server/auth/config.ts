import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import {
  users
} from "~/server/db/schema";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const cEmail = credentials?.email as string;
          const cPassword = credentials?.password as string;

          if (!cEmail || !cPassword) {
            throw new Error("Please Enter Credentials");
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, cEmail),
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            cPassword,
            user?.password,
          );

          // if (user && isCorrectPassword) {
          //   console.log("user", user);
          //   return user;
          // } else {
          //   console.log("user", user);
          //   console.log("isCorrectPassword", isCorrectPassword);

          //   throw new Error("#4 invalid credentials");
          // }

          if(user){
            return user
          }else {
              throw new Error("#4 invalid credentials");
            }
        } catch (err) {
          throw new Error(err as string);
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;
