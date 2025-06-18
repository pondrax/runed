<script lang="ts">
	import { page } from '$app/state';
	import { api, app } from '$lib/app';

	let { children } = $props();
	const schema = api.send('/api/schema');
</script>

<div class="drawer drawer-open">
	<input id="main" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		{@render children()}
	</div>
	<div class="drawer-side">
		<ul class="menu bg-base-100 border-neutral/20 z-1 h-screen w-15 gap-3 border-r px-2 py-5">
			<a href="/_/#">
				<img src="/favicon.png" class="w-full" alt="icon" />
			</a>
			<li>
				<a
					href="/_/collections"
					class:menu-active={page.url.pathname?.includes('collections')}
					class="justify-center rounded-lg p-1"
					aria-label="collections"
				>
					<iconify-icon icon="bx:data" class="text-3xl"></iconify-icon>
				</a>
			</li>
			<li class="mt-auto">
				<button type="button" class="justify-center rounded-lg p-1" aria-label="setting">
					<iconify-icon icon="bx:sun" class="text-3xl"></iconify-icon>
				</button>
			</li>
			<li>
				<button
					type="button"
					class="justify-center rounded-lg p-1"
					aria-label="setting"
					onclick={() => (app.sidebar = !app.sidebar)}
				>
					<iconify-icon
						icon={app.sidebar ? 'bx:arrow-to-left' : 'bx:arrow-to-right'}
						class="text-3xl"
					></iconify-icon>
				</button>
			</li>
		</ul>
	</div>
</div>
