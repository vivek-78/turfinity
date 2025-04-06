import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateUniqueId } from "./utils";

export const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(
          z.object({
            firstName: z.string().min(4).max(255),
            lastName: z.string().min(4).max(255),
            email: z.string().email().max(100),
            password: z.string().min(8).max(50),
            phone: z.string().min(10).max(15)
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { firstName, lastName, email, password, phone } = input;
    
          const isExist = await ctx.db.query.users.findFirst({
            where: eq(users.email, email)
          });
    
          if (isExist) {
            throw Error("User already exists");
          }
    
          const hashPassword = await bcrypt.hash(password, 10);
          const userId = generateUniqueId("USR");
          await ctx.db.insert(users).values({
            id: userId,
            firstName,
            lastName,
            email: email,
            phoneNumber: phone,
            password: hashPassword,
            // image: DEFAULT_AVATAR
          });
    
          const returnData = {
            name: `${firstName} ${lastName}`,
            id: userId,
            // role: DEFAULT_ROLE
          };
    
          return returnData;
        })
})