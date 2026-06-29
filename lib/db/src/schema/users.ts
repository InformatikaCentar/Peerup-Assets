import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { schoolsTable } from "./schools";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schoolsTable.id),
  uloga: text("uloga").notNull(), // "admin" | "ucitelj" | "ucenik"
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  kod: text("kod").unique(),
  ime: text("ime"),
  prezime: text("prezime"),
  razred: text("razred"),
  firstLogin: boolean("first_login").notNull().default(true),
  aktivan: boolean("aktivan").notNull().default(true),
  bodovi: integer("bodovi").notNull().default(0),
  avatar: text("avatar").notNull().default("🧑‍🎓"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
