import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mzoSchoolsTable = pgTable("mzo_schools", {
  id: serial("id").primaryKey(),
  oib: text("oib").notNull().unique(),
  sifraSkole: text("sifra_skole").notNull().unique(),
  naziv: text("naziv").notNull(),
});

export const insertMzoSchoolSchema = createInsertSchema(mzoSchoolsTable).omit({ id: true });
export type InsertMzoSchool = z.infer<typeof insertMzoSchoolSchema>;
export type MzoSchool = typeof mzoSchoolsTable.$inferSelect;
