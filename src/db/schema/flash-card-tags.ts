import {relations} from "drizzle-orm";
import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";

import {flashCards} from "./flash-cards";
import {tags} from "./tags";

/**
 * This table represents the many-to-many relationship between flash cards and tags.
 * Each flash card can have multiple tags, and each tag can be associated with multiple flash cards.
 *
 * Columns:
 * - flashCardId: References the id of the flash card. On deletion of the flash card, the corresponding entries in this table will be deleted (cascade).
 * - tagId: References the id of the tag. On deletion of the tag, the corresponding entries in this table will be deleted (cascade).
 *
 * Primary Key:
 * - A composite primary key consisting of flashCardId and tagId.
 */

export let flashCardTags = pgTable(
  "flash_card_tags",
  {
    flashCardId: integer("flash_card_id")
      .references(() => flashCards.id, {onDelete: "cascade"})
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tags.id, {onDelete: "cascade"})
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({columns: [table.flashCardId, table.tagId]}),
  }),
);

export let flashCardTagsRelations = relations(
  flashCardTags,
  ({one}) => ({
    flashCard: one(flashCards, {
      fields: [flashCardTags.flashCardId],
      references: [flashCards.id],
    }),
    tag: one(tags, {
      fields: [flashCardTags.tagId],
      references: [tags.id],
    }),
  }),
);
