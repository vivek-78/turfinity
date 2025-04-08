import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "~/server/db";
import {
  users,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | null;
  }
  interface Session extends DefaultSession {
    user: {
      id?: string | undefined;
      firstName?: string | undefined;
      lastName?: string | undefined;
      email?: string | null;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.username as string),
          });

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user?.password ?? ""
          );
          if (user && isValidPassword) {
            console.log("success")
            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              emailVerified: user.emailVerified,
              image: user.image,
            };
          } else {
            console.log("fail")
            throw new Error("#4 invalid credentials");
          }
        } catch (err) {
          console.error(err);
          throw new Error(err as string);
        }
      }
    }),
  ],
  logger: {
    error: (error) => {
      console.error("Error in authConfig logger", error);
    },
    debug: (message) => {
      console.debug("Debug in authConfig logger", message);
    },
    warn: (message) => {
      console.warn("Warning in authConfig logger", message);
    },
  },
  adapter: DrizzleAdapter(db),
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.id as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          email: token.email!,
          image: session.user?.image, // Keep the image from the default session
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;

// pages: {
//   signIn: "/auth/signin",
// },