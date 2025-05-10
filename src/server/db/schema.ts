import { relations, sql } from "drizzle-orm";
import { boolean, decimal, index, integer, pgEnum, pgTable, pgTableCreator, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const BOOKING_STATUS = pgEnum("BOOKING_STATUS", [
  "scheduled",
  "cancelled",
  "ongoing",
  "completed",
]);

export const createTable = pgTableCreator((name) => `turfinity_${name}`);

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  // sportsComplexId: text("sports_complex_id").references(() => sportsComplex.id)
})

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const sportsComplex  = pgTable("sports_complex",{
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  mobileNumber: text("mobileNumber"),
  owner: text("owner").references(() => users.id)
})

export const courts = pgTable("courts",{
  id: text("id").primaryKey(),
  courtNumber: text("court_number"),
  name: text("name").notNull(),
  sport: text("sport"),
  sportsComplexId: text("sports_complex_id").references(() => sportsComplex.id),
  price: integer("price").notNull(),
});

export const inventory = pgTable("inventory", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  quantity: decimal("quantity"),
  sport: text("sport")
});

export const inventoryItems = pgTable("inventory_items",{
  id: text("id").primaryKey(),
  name: text("name"),
  sportsComplexId: text("sports_complex_id").references(() => sportsComplex.id)
});

export const courtBookings = pgTable("court_bookings",{
  id: text("id").primaryKey(),
  courtId: text("court_id").references(() => courts.id),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  inventoryGiven: boolean("inventory_given"),
  inventoryRecived: boolean("inventory_received"),
  status: BOOKING_STATUS("status"),
  amount: integer("amount"),
  paymentMode: text("payment_mode"),
})