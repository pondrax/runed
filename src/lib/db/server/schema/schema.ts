import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { created, id, updated } from '../utils';

export const users = pgTable('users', {
	id: id(),
	age: integer('age'),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password'),
	created,
	updated
});

export const interns = pgTable('interns', {
	id: id(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password'),
	created,
	updated
});

export const posts = pgTable('posts', {
	id: id(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull(),
	media: text('media'),
	user_id: text('user_id'), //.references(() => users.id ?? interns.id),
	created,
	updated
});

export const comments = pgTable('comments', {
	id: id(),
	content: text('content').notNull(),
	post_id: text('post_id').notNull(), // .references(() => posts.id),
	user_id: text('user_id').notNull(), // .references(() => users.id ?? interns.id),
	created,
	updated
});
