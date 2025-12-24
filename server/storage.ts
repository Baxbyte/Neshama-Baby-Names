import { users, savedNames, type User, type InsertUser, type SavedName, type InsertSavedName } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Saved Names methods
  getSavedNames(): Promise<SavedName[]>;
  getSavedName(id: string): Promise<SavedName | undefined>;
  createSavedName(name: InsertSavedName): Promise<SavedName>;
  deleteSavedName(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Saved Names methods
  async getSavedNames(): Promise<SavedName[]> {
    return await db.select().from(savedNames).orderBy(desc(savedNames.savedAt));
  }

  async getSavedName(id: string): Promise<SavedName | undefined> {
    const [name] = await db.select().from(savedNames).where(eq(savedNames.id, id));
    return name || undefined;
  }

  async createSavedName(insertName: InsertSavedName): Promise<SavedName> {
    const [name] = await db
      .insert(savedNames)
      .values(insertName)
      .returning();
    return name;
  }

  async deleteSavedName(id: string): Promise<void> {
    await db.delete(savedNames).where(eq(savedNames.id, id));
  }
}

export const storage = new DatabaseStorage();
