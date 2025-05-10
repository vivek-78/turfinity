import { inventoryItems, sportsComplex } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const inventoryRouter = createTRPCRouter({
    getAllInventoryItems: protectedProcedure.input(z.object({ sportsComplexId: z.string()})).query(async({ ctx,input}) => {
        return await ctx.db.query.inventoryItems.findMany({
            where: eq(inventoryItems.sportsComplexId, input.sportsComplexId)
        })
    })
})