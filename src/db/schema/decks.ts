import {relations} from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {users} from "./users";

export let decks = pgTable(
  "decks",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", {length: 100}).notNull(),
    userId: integer("user_id")
      .references(() => users.id, {onDelete: "cascade"})
      .notNull(),
    createdAt: timestamp("created_at", {mode: "string"})
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {mode: "string"})
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    nameIndex: index("name_idx").on(table.name),
  }),
);

export let decksRelations = relations(decks, ({one}) => ({
  // A deck belongs to one user
  user: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
}));
