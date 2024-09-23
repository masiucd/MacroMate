import {relations} from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {flashCardTags} from "./flash-card-tags";

export let tags = pgTable("tags", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", {length: 100}).notNull(),
  createdAt: timestamp("created_at", {mode: "string"})
    .defaultNow()
    .notNull(),
});

export let tagsRelations = relations(tags, ({many}) => ({
  flashCardTags: many(flashCardTags),
}));
