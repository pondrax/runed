<script lang="ts">
	import '../app.css';
	import 'iconify-icon';
	import { app } from '$lib/app';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<progress class="progress fixed top-0 z-15 h-2 w-full" class:invisible={!app.loading}></progress>
<!-- {#if app.loading}
	<div class="fixed top-0 right-0 left-0 z-10 -mt-3" in:fade>
		<progress class="progress w-full"></progress>
	</div>
  {/if} -->
<!-- <div class="skeleton bg-neutral/80 fixed right-0 left-0 z-10 h-2 rounded-none" in:fade></div> -->
{@render children()}

<div id="main-toast" class="toast z-99">
	<div class="not-hover:stack stack-top flex w-64 flex-col gap-1">
		{#each app.alerts as alert}
			<div
				role="alert"
				class="alert bg-base-100 shadow-base-content/20 relative items-start rounded-xl shadow"
				onfocus={() => alert.pause()}
				onmouseover={() => alert.pause()}
				onblur={() => alert.start()}
				onmouseout={() => alert.start()}
			>
				<div class="-mr-5">
					<div class="mb-2 flex items-center gap-2">
						{#if alert.type == 'error'}
							<iconify-icon icon="bx:error-circle" class="text-error text-2xl"></iconify-icon>
							Error
						{:else}
							<iconify-icon icon="bx:info-circle" class="text-info text-2xl"></iconify-icon>
							Success
						{/if}
					</div>
					<div>{alert.message}</div>
					{#if alert.error}
						{#each alert.error || [] as err}
							<div>
								<span class="font-semibold">{err?.path}</span>
								:
								{err?.message}
							</div>
						{/each}
					{/if}
					<!-- {JSON.stringify(alert)} -->
				</div>
				<button onclick={alert.clear} class="btn btn-sm btn-neutral absolute -top-2 right-2">
					x
				</button>
			</div>
		{/each}
	</div>
</div>
