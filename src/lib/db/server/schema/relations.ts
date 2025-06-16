import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	users: {
		posts: r.many.posts(),
		comments: r.many.comments()
	},
	posts: {
		author: r.one.users({
			from: r.posts.user_id,
			to: r.users.id
		}),
		comments: r.many.comments()
	},
	comments: {
		posts: r.one.posts({ from: r.comments.post_id, to: r.posts.id }),
		writer: r.one.users({ from: r.comments.user_id, to: r.users.id })
	}
}));
