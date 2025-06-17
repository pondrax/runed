<script lang="ts">
	let { children } = $props();
</script>

<div class="p-2">
	<ul class="menu menu-horizontal bg-base-200 w-full rounded-xl p-1">
		<li><a href="/demo/paraglide">paraglide</a></li>
		<li><a href="/demo/client">client</a></li>
	</ul>
	{@render children()}
</div>
