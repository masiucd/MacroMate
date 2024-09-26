// import {relations} from "drizzle-orm";
import {relations} from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import {decks} from "./decks";

// import {categories} from "./categories";

export let users = pgTable(
  "users",
  {
    id: serial("id").primaryKey().notNull(),
    firstName: varchar("first_name", {length: 100}).notNull(),
    lastName: varchar("last_name", {length: 100}).notNull(),
    email: varchar("email", {length: 120}).notNull(),
    password: varchar("password", {length: 300}).notNull(),
    admin: boolean("admin").default(false).notNull(),
    createdAt: timestamp("created_at", {mode: "string"})
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {mode: "string"})
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("email_index").on(table.email),
  }),
);

export let usersRelations = relations(users, ({many}) => ({
  //  one-to-many relationship between users and decks
  decks: many(decks),
}));
