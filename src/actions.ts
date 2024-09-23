"use server";
import "server-only";

import {revalidatePath} from "next/cache";

import {db} from "./db";
import {decks} from "./db/schema";

export async function createDeck(
  prevState: {message: string} | null,
  data: FormData,
) {
  try {
    let name = data.get("name");
    let userId = data.get("userid");
    if (typeof name !== "string" || typeof userId !== "string") {
      return {message: "Invalid input"};
    }
    await insertIntoDecks(name, Number(userId));
    revalidatePath("/dashboard");
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating deck:", error);
    return {message: "Error creating deck"};
  }
}

async function insertIntoDecks(name: string, userId: number) {
  try {
    await db.insert(decks).values({name, userId});
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error inserting into decks:", error);
    return false;
  }
}
