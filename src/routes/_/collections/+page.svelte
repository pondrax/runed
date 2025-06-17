<script lang="ts">
	import { api } from '$lib/app';
	import type { DB } from '$lib/db/server/types';

	type TableName = keyof DB['schema'];
	let table: TableName = $state('users');

	const TABLES: TableName[] = ['users', 'posts', 'comments'];
	const { records } = $derived(api(table, {}));
</script>

<main class="">
	<ul class="menu menu-horizontal bg-base-100 rounded-box w-full gap-1">
		{#each TABLES as key}
			<li>
				<button type="button" onclick={() => (table = key)} class:menu-active={key === table}>
					{key}
				</button>
			</li>
		{/each}
	</ul>

	<div class="px-3">
		<h3>{table}</h3>
		<div class="text-xs whitespace-pre-wrap">{JSON.stringify(records.current, null, 2)}</div>
	</div>
</main>
