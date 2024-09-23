import {relations} from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {decks} from "./decks";

// Adding notes to a deck
export let deckNotes = pgTable("deck_notes", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", {length: 100}).notNull(),
  note: text("note").notNull(),
  deckId: integer("deck_id")
    .references(() => decks.id, {onDelete: "cascade"})
    .notNull(),
  createdAt: timestamp("created_at", {mode: "string"})
    .defaultNow()
    .notNull(),
});

export let deckNotesRelations = relations(deckNotes, ({one}) => ({
  deck: one(decks, {
    fields: [deckNotes.deckId],
    references: [decks.id],
  }),
}));
