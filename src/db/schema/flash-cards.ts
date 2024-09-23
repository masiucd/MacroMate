import {relations} from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {decks} from "./decks";

export let flashCards = pgTable("flash_cards", {
  id: serial("id").primaryKey().notNull(),
  deckId: integer("deck_id")
    .references(() => decks.id, {onDelete: "cascade"})
    .notNull(),
  question: varchar("question", {length: 255}).notNull(),
  answer: varchar("answer", {length: 100}).notNull(),
  createdAt: timestamp("created_at", {mode: "string"})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {mode: "string"})
    .defaultNow()
    .notNull(),
});

export let flashCardsRelations = relations(flashCards, ({one}) => ({
  // A flash card belongs to one deck
  deck: one(decks, {
    fields: [flashCards.deckId],
    references: [decks.id],
  }),
}));
