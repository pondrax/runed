<script lang="ts">
	import { api } from '$lib/app';

	const { records, request, query } = api('users', {
		search: '',
		with: {
			posts: true
		}
	});
</script>

<main class="space-y-3">
	<label class="input">
		<input type="search" placeholder="Search" bind:value={query.search} />
		<span class="label">
			<iconify-icon icon="bx:search"></iconify-icon>
		</span>
	</label>

	<div class="textarea rounded-xl text-xs whitespace-pre-wrap">
		{JSON.stringify(query, null, 2)}
	</div>

	{#if records.loading}
		<div>Loading...</div>
	{:else if records.error}
		<div>Error: {records.error.message}</div>
	{:else}
		<ul>
			{#each records.current?.items ?? [] as item}
				<li>{item.id}</li>
			{/each}
		</ul>
	{/if}
</main>
