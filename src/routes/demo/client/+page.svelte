<script lang="ts">
	import { api } from '$lib/app';

	const record = api.get('users', {
		search: '',
		orderBy: { id: 'desc' }
	});
</script>

<main class="space-y-3">
	<label class="input">
		<input type="search" placeholder="Search" bind:value={record.query.search} />
		<span class="label">
			<iconify-icon icon="bx:search"></iconify-icon>
		</span>
	</label>

	<div class="textarea rounded-xl text-xs whitespace-pre-wrap">
		{JSON.stringify(record.query, null, 2)}
	</div>

	{#if record.loading}
		<div>Loading...</div>
	{:else if record.error}
		<div>Error: {record.error.message}</div>
	{:else}
		<ul>
			{#each record.current?.items ?? [] as item}
				<li>{item.id}</li>
			{/each}
		</ul>
	{/if}
</main>
