import {relations} from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import {decks} from "./decks";
import {users} from "./users";

// This table represents a study session for a user. used for analytics and tracking user progress
export let studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .references(() => users.id, {onDelete: "cascade"})
    .notNull(),
  deckId: integer("deck_id")
    .references(() => decks.id, {onDelete: "cascade"})
    .notNull(),
  sessionDate: timestamp("session_date", {mode: "string"})
    .defaultNow()
    .notNull(),
  duration: integer("duration").notNull(), // in minutes
});

export let studySessionsRelations = relations(
  studySessions,
  ({one}) => ({
    // A study session belongs to one user
    user: one(users, {
      fields: [studySessions.userId],
      references: [users.id],
    }),
    // A study session belongs to one deck
    deck: one(decks, {
      fields: [studySessions.deckId],
      references: [decks.id],
    }),
  }),
);
