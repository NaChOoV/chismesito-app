import { relations } from 'drizzle-orm';
import { integer, text, geometry, index, pgTable, timestamp, serial } from 'drizzle-orm/pg-core';

export const gossip = pgTable(
    'gossip',
    {
        id: serial().primaryKey(),
        title: text('title').notNull(),
        description: text('description').notNull(),
        location: geometry('location', {
            type: 'point',
            mode: 'xy',
            srid: 4326,
        }).notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [index('location_idx').using('gist', table.location)]
);

export const gossipRelations = relations(gossip, ({ many }) => ({
    comment: many(comment),
}));

export const comment = pgTable('comment', {
    id: serial('id').primaryKey(),
    gossipId: integer('gossip_id').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const commentRelations = relations(comment, ({ one }) => ({
    gossip: one(gossip, {
        fields: [comment.gossipId],
        references: [gossip.id],
    }),
}));

export type GossipType = typeof gossip.$inferSelect;
export type CommentType = typeof comment.$inferInsert;
