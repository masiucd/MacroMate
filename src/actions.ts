"use server";
import "server-only";

import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import {getUserByEmail, insertIntoDecks} from "./db/dao/decks";
import {redis} from "./db/redis";
import {encrypt} from "./lib/utils/jwt";
import {verifyPassword} from "./lib/utils/password";

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

export async function login(
  prevState: {message: string} | null,
  data: FormData,
) {
  let email = data.get("email");
  let password = data.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return {message: "Invalid Credentials"};
  }

  let user = await getUserByEmail(email);
  if (user === null) {
    return {message: "Invalid Credentials"};
  }
  let passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    return {message: "Invalid Credentials"};
  }

  let token = await encrypt({userId: user.id, email: user.email});
  if (token === null) {
    return {message: "Error Logging In"};
  }

  setSessionAndCookie(user.id, token);
  redirect("/dashboard");
}

const ONE_HOUR = 60 * 60; // 1 hour 3600 seconds
function setSessionAndCookie(userId: number, token: string) {
  redis.setex(`session:${userId}`, ONE_HOUR, token); // 1 hour expiry
  let cookieStore = cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_HOUR,
    path: "/",
  });
}
