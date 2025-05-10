import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { courts, sportsComplex } from "~/server/db/schema";
import { generateUniqueId } from "./utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const courtRouter = createTRPCRouter({
    addSportsComplex: protectedProcedure.input(z.object({
        name: z.string(),
        address: z.string(),
        mobileNumber: z.string()
    })).mutation(async ({ ctx, input }) => {
        try {
            const complexId = generateUniqueId("cmplx")
            await ctx.db.insert(sportsComplex).values({
                id: complexId,
                name: input.name,
                mobileNumber: input.mobileNumber,
                address: input.address,
                owner: ctx.session.user.id
            });
            return { id: complexId }
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : String(err))
        }
    }),
    addCourt: protectedProcedure.input(z.object({
        complexId: z.string().optional(),
        name: z.string(),
        courtNumber: z.string(),
        sport: z.string(),
        price: z.number(),
    })).mutation(async ({ ctx, input }) => {
        if (!input.complexId)
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No Sports Complex"
            })
        const courtId = generateUniqueId("crt")
        await ctx.db.insert(courts).values({
            id: courtId,
            name: input.name,
            sport: input.sport,
            courtNumber: input.courtNumber,
            sportsComplexId: input.complexId,
            price: input.price
        });
    }),
    getCourtsByComplexId: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.query.courts.findMany({
            where: eq(courts.sportsComplexId, input.id)
        })
    }),
    getCourtDetailsById: protectedProcedure.input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            await ctx.db.query.courts.findFirst({
                where: eq(courts.id, input.id)
            })
        })
})