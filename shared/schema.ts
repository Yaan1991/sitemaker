import { sql } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Счётчики скачиваний приложений Kuzmichev Tools (по ключу приложения).
export const downloadCounters = pgTable("download_counters", {
  key: varchar("key").primaryKey(),
  count: integer("count").notNull().default(0),
});

export type DownloadCounter = typeof downloadCounters.$inferSelect;
