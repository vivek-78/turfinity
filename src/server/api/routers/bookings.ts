import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { courtBookings, courts, sportsComplex } from "~/server/db/schema";
import { generateUniqueId } from "./utils";
import { TRPCError } from "@trpc/server";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { create } from "domain";
import { date } from "drizzle-orm/pg-core";
import { start } from "repl";
import { endOfDay, startOfDay } from "date-fns";

export const bookingsRouter = createTRPCRouter({
    createBooking: protectedProcedure.input(z.object({
        name: z.string(),
        courtId: z.string(),
        mobile: z.string(),
        email: z.string(),
        inventoryGiven: z.boolean().optional(),
        inTime: z.coerce.date(),
    })).mutation(async ({ ctx, input }) => {
        const bookingId = generateUniqueId("crt_bk")
        await ctx.db.insert(courtBookings).values({
            id: bookingId,
            name: input.name,
            courtId: input.courtId,
            phone: input.mobile,
            email: input.email,
            startTime: input.inTime,
            status: "ongoing",
            inventoryGiven: input.inventoryGiven,
            inventoryRecived: false
        });
    }
    ),
    getbookingsByComplexId: protectedProcedure.input(z.object({
        complexId: z.string(),
        status: z.enum(["ongoing", "completed", "cancelled"]).optional(),
        date: z.coerce.date().optional()
    })).query(async ({ ctx, input }) => {
        const filter = [];
        if (input.status) {
            filter.push(eq(courtBookings.status, input.status))
        }
        if (input.date) {
            const startDate = startOfDay(input.date);
            const endDate = endOfDay(input.date);
            filter.push(and(gte(courtBookings.startTime, startDate), lte(courtBookings.endTime, endDate)));
        }
        const bookings = await ctx.db.select({ courtBookings, court: courts })
            .from(courtBookings)
            .innerJoin(courts, eq(courtBookings.courtId, courts.id))
            .innerJoin(sportsComplex, eq(courts.sportsComplexId, sportsComplex.id))
            .where(and(eq(sportsComplex.id, input.complexId), ...filter))
            .orderBy(asc(courtBookings.startTime))

        return bookings
    }),
    closeBooking: protectedProcedure.input(z.object({
        bookingId: z.string(),
        outTime: z.coerce.date(),
        inventoryRecived: z.boolean().optional(),
        amountCollected: z.coerce.number().optional(),
        paymentMode: z.enum(["Cash", "UPI", "Card"]).optional(),
    })).mutation(async ({ ctx, input }) => {
        const [booking] = await ctx.db.select().from(courtBookings).where(eq(courtBookings.id, input.bookingId));
        if (!booking) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Booking not found"
            })
        }
        if (booking.status !== "ongoing") {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "You cannot close ongoing bookings"
            })
        }
        await ctx.db.update(courtBookings).set({
            endTime: input.outTime,
            status: "completed",
            inventoryRecived: input.inventoryRecived,
            amount: input.amountCollected,
            paymentMode: input.paymentMode
        }).where(eq(courtBookings.id, input.bookingId));
    })
})