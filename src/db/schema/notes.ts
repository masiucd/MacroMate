import {relations} from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {users} from "./users";

// this is note for the user to write down their thoughts and ideas
export let notes = pgTable("notes", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", {length: 100}).notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .references(() => users.id, {onDelete: "cascade"})
    .notNull(),
  createdAt: timestamp("created_at", {mode: "string"})
    .defaultNow()
    .notNull(),
});

export let notesRelations = relations(notes, ({one}) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
