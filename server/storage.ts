import { downloadCounters, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { db } from "./db";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  incrementDownloadCount(key: string): Promise<number>;
  getDownloadCount(key: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Счётчики скачиваний должны переживать перезапуск, поэтому идём напрямую в PostgreSQL.
  async incrementDownloadCount(key: string): Promise<number> {
    const [row] = await db
      .insert(downloadCounters)
      .values({ key, count: 1 })
      .onConflictDoUpdate({
        target: downloadCounters.key,
        set: { count: sql`${downloadCounters.count} + 1` },
      })
      .returning();
    return row.count;
  }

  async getDownloadCount(key: string): Promise<number> {
    const row = await db.query.downloadCounters.findFirst({
      where: (c, { eq }) => eq(c.key, key),
    });
    return row?.count ?? 0;
  }
}

export const storage = new MemStorage();
