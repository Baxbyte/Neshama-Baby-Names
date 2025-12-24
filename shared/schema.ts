import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const savedNames = pgTable("saved_names", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").default(""),
  hebrewName: text("hebrew_name").default(""),
  lastName: text("last_name").default(""),
  firstNameHebrew: text("first_name_hebrew").default(""),
  hebrewNameHebrew: text("hebrew_name_hebrew").default(""),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSavedNameSchema = createInsertSchema(savedNames).omit({
  id: true,
  savedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SavedName = typeof savedNames.$inferSelect;
export type InsertSavedName = z.infer<typeof insertSavedNameSchema>;
