<script lang="ts">
	import { page } from '$app/state';
	import { api, app } from '$lib/app';
	import type { DB } from '$lib/db/client';

	type TableName = keyof DB['schema'];
	let table: TableName = $derived(page.params.tableName as TableName);

	const record = $derived(
		api.findMany(table, {
			search: '',
			orderBy: { id: 'desc' },
			offset: 0,
			limit: 15
		})
	);
	const schema = api.send('/api/schema');
	const items = $derived(record.current?.items ?? []);

	const columns = $derived(Object.entries(schema.current?.tables?.[table]?.columns ?? {})) as [
		string,
		{ type: string; primaryKey: boolean }
	][];
	// const columns = $derived(record.current?.meta?.columns ?? []);
</script>

<div class="drawer" class:drawer-open={app.sidebar}>
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex h-screen min-h-0 flex-col p-2">
		<div class="bg-base-100 rounded-box h-full p-2 shadow">
			<div class="space-y-2 p-3">
				<div class="flex justify-between">
					<div class="breadcrumbs p-0 text-sm capitalize">
						<ul>
							<li>
								<a href="./" aria-label="home">
									<iconify-icon icon="bx:data" class="text-xl"></iconify-icon>
								</a>
							</li>
							<li><a href="/_/collections">collections</a></li>
							<li>
								<div>
									{table}
									<button type="button" class="btn btn-sm btn-circle" aria-label="config">
										<iconify-icon icon="bx:cog"></iconify-icon>
									</button>
								</div>
							</li>
						</ul>
					</div>

					<button type="button" class="btn btn-sm btn-secondary">
						<iconify-icon icon="bx:plus"></iconify-icon>
						Add Record
					</button>
				</div>

				<div class="flex justify-between gap-2">
					<div class="flex gap-2">
						<label class="input input-sm">
							<iconify-icon icon="bx:search" class="text-xl"></iconify-icon>
							<input
								type="search"
								placeholder="Search"
								bind:value={record.query.search}
								class="w-30 transition-all focus:w-100"
							/>
						</label>
					</div>

					<div class="flex gap-2">
						<div class="dropdown dropdown-end -mr-2">
							<div
								tabindex="0"
								role="button"
								class="btn btn-sm btn-ghost font-normal hover:bg-transparent"
							>
								{record.current?.elapsed} ms •
								{record.query.offset + 1} - {Math.min(
									record.query.offset + record.query.limit,
									record.current?.totalItems ?? 0
								)}
								of {record.current?.totalItems ?? '-'}
							</div>
							<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
							<ul
								tabindex="0"
								class="dropdown-content menu bg-base-200 rounded-box z-1 mt-1 w-16 p-0 shadow-sm"
							>
								{#each [15, 25, 50, 100, 150, 250, 500] as limit}
									<li>
										<button
											type="button"
											onclick={() => (record.query.limit = limit)}
											class:menu-active={record.query.limit === limit}
											class="justify-end"
										>
											{limit}
										</button>
									</li>
								{/each}
							</ul>
						</div>

						<div class="join">
							<button
								type="button"
								class="btn btn-sm join-item"
								aria-label="refresh"
								onclick={() =>
									(record.query.offset = Math.max(0, record.query.offset - record.query.limit))}
							>
								<iconify-icon icon="bx:chevron-left"></iconify-icon>
							</button>

							<input
								type="number"
								class="input input-sm input-bordered w-15"
								min="1"
								bind:value={
									() => Math.ceil(record.query.offset / record.query.limit) + 1,
									(v) => (record.query.offset = (v - 1) * record.query.limit)
								}
							/>
							<button
								type="button"
								class="btn btn-sm join-item"
								aria-label="refresh"
								onclick={() => (record.query.offset += record.query.limit)}
							>
								<iconify-icon icon="bx:chevron-right"></iconify-icon>
							</button>
						</div>
						<button
							type="button"
							class="btn btn-sm join-item"
							aria-label="refresh"
							onclick={record.refetch}
						>
							<iconify-icon icon="bx:refresh" class:animate-spin-reverse={record.loading}
							></iconify-icon>
						</button>

						<div class="dropdown dropdown-end">
							<div tabindex="0" role="button" class="btn btn-sm join-item">
								<iconify-icon icon="bx:dots-horizontal"></iconify-icon>
							</div>
							<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
							<ul
								tabindex="0"
								class="dropdown-content menu bg-base-200 rounded-box z-1 mt-1 w-52 p-0 shadow-sm"
							>
								<li>
									<button onclick={record.refetch}>
										<iconify-icon icon="bx:refresh" class="text-lg"></iconify-icon>
										Refresh Rows
									</button>
								</li>
								<li class="m-0"></li>
							</ul>
						</div>
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="table-sm table-zebra table w-full">
						<thead>
							<tr>
								<th class="w-1">
									{#if record.loading}
										<span class="loading loading-spinner" style="--size-selector:4px"> </span>
									{:else}
										<input type="checkbox" class="checkbox" />
									{/if}
								</th>
								{#each columns as [key, prop]}
									{@const currentOrder = (
										record.query.orderBy as Record<string, string | undefined>
									)[key]}
									<th class="!p-0" class:w-1={prop.primaryKey}>
										<button
											type="button"
											class="btn btn-sm btn-ghost w-full"
											onclick={() => {
												record.query.orderBy = {
													[key]: currentOrder == 'asc' ? 'desc' : 'asc'
												};
											}}
										>
											<iconify-icon
												icon={prop.primaryKey
													? 'bx:key'
													: prop.type == 'integer'
														? 'bx:hash'
														: prop.type.includes('timestamp')
															? 'bx:calendar'
															: prop.type == 'boolean'
																? 'bx:checkbox'
																: 'bx:text'}
												class="-mb-0"
											></iconify-icon>
											<span>
												{key}
											</span>
											<span class="ml-auto">
												{#if currentOrder == 'desc'}
													<iconify-icon icon="bx:down-arrow-alt" class="text-lg"></iconify-icon>
												{:else if currentOrder == 'asc'}
													<iconify-icon icon="bx:up-arrow-alt" class="text-lg"></iconify-icon>
												{/if}
											</span>
										</button>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#if record.current?.totalItems === 0}
								<tr>
									<td colspan="100">No records found</td>
								</tr>
							{:else}
								{#each items as item}
									<tr>
										<th class="w-1">
											<input type="checkbox" class="checkbox" />
										</th>
										{#each columns as [key, prop]}
											{#if prop.primaryKey}
												<td class="w-1">
													<div class="join">
														<button
															type="button"
															class="btn btn-soft btn-xs join-item tooltip"
															onclick={(event) => {
																const button = event.currentTarget as HTMLButtonElement;
																navigator.clipboard.writeText(item[key]);
																button.dataset.tip = 'Copied';
																setTimeout(() => {
																	button.dataset.tip = 'Copy';
																}, 3000);
															}}
															aria-label="copy"
															data-tip="Copy"
														>
															<iconify-icon icon="bx:copy"></iconify-icon>
															{item[key]}
														</button>
													</div>
												</td>
											{:else if prop.type.includes('timestamp')}
												<td class="w-1 whitespace-nowrap">
													{item[key] ? new Date(item[key]).toLocaleString() : ''}
												</td>
											{:else}
												<td>
													{item[key]}
												</td>
											{/if}
										{/each}
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
				<div class="p-5">
					<div class="text-xs whitespace-pre-wrap">
						{JSON.stringify(record.current, null, 2)}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="drawer-side">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 flex h-screen w-50">
			<ul class="menu bg-base-200 text-base-content h-full w-full py-5 pr-1">
				<li>
					<div class="border-base-300 flex border-1 !p-0">
						<input type="search" class="input input-ghost w-full" placeholder="Search Collection" />
					</div>
				</li>
				<li class="my-3">
					<button type="button" class="btn btn-primary btn-sm" onclick={() => {}}>
						<iconify-icon icon="bx:plus"></iconify-icon>
						New Collection
					</button>
				</li>
				{#if schema.loading}
					<li class="px-3">
						<div class="loading loading-spinner"></div>
					</li>
				{:else}
					{#each Object.entries(schema?.current?.tables ?? {}) as [key, value]}
						<li>
							<a href="/_/collections/{key}" class:menu-active={page.params.tableName == key}>
								<iconify-icon icon="bx:table"></iconify-icon>
								{key}
							</a>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</div>
</div>
