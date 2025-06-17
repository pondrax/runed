<script lang="ts">
	let { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex h-screen min-h-0 flex-col p-2">
		<div class="bg-base-100 rounded-box h-full p-2 shadow">
			{@render children()}
		</div>
	</div>
	<div class="drawer-side">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-64 p-4">
			<li>
				<a href="./collections">Collections</a>
			</li>
		</ul>
	</div>
</div>
