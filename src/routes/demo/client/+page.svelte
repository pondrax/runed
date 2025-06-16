<script lang="ts">
	import { client } from '$lib/db/client';
	import { resource } from 'runed';

	let query = $state({
		search: '',
		with: {
			posts: true
		}
	});

	const records = resource(
		() => query,
		async (props) => {
			console.log(props);
			const result = await client.from('users').findMany(props);
			return result;
		}
	);
	// const searchResource = resource(
	// 	() => query,
	// 	async (id, prevId, { data, refetching, onCleanup, signal }) => {
	// 		console.log(id, prevId, data, refetching, onCleanup, signal);
	// 		// data: the previous value returned from the fetcher

	// 		// refetching: whether the fetcher is currently refetching
	// 		// or it can be the value you passed to refetch()

	// 		// onCleanup: A cleanup function that will be called when the source is invalidated
	// 		// and the fetcher is about to re-run

	// 		// signal: AbortSignal for cancelling fetch requests
	// 		// const response = await fetch(`api/posts?id=${id}`, { signal });

	// 		const result = await client.from('users').findMany(query);
	// 		console.log(result);
	// 		return result;
	// 	},
	// 	{
	// 		debounce: 300
	// 		// lazy: Skip initial fetch when true
	// 		// once: Only fetch once when true
	// 		// initialValue: Provides an initial value for the resource
	// 		// debounce: Debounce rapid changes
	// 		// throttle: Throttle rapid changes
	// 	}
	// );

	// // The current value of the resource
	// // searchResource.current;
	// // // Whether the resource is currently loading
	// // searchResource.loading;
	// // // Error if the fetch failed
	// // searchResource.error;
	// // // Update the resource value directly, useful for optimistic updates
	// // searchResource.mutate({
	// //   items: [
	// //     {
	// //       email: 'test@example.com',
	// //       name: 'John Doe'  ,
	// //       id: ''

	// //     }
	// //   ]
	// // });
	// // // Re-run the fetcher with current watching values
	// // searchResource.refetch();
</script>

<input type="search" bind:value={query.search} placeholder="Search" />

{JSON.stringify(query)}
{#if records.loading}
	<div>Loading...</div>
{:else if records.error}
	<div>Error: {records.error.message}</div>
{:else}
	<ul>
		{#each records.current?.items ?? [] as item}
			<li>{item.email}</li>
		{/each}
	</ul>
{/if}
