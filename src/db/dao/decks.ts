import "server-only";

import {eq} from "drizzle-orm";

import {db} from "..";
import {decks, users} from "../schema";

export async function insertIntoDecks(name: string, userId: number) {
  try {
    await db.insert(decks).values({name, userId});
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error inserting into decks:", error);
    return false;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user[0];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting user by email:", error);
    return null;
  }
}
