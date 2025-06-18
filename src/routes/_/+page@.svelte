<script lang="ts">
	import { goto } from '$app/navigation';

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		goto('/_/collections');
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form onsubmit={submit} class="bg-base-100 border-base-300 rounded-box w-sm space-y-3 border p-5">
		<h3 class="text-lg">Login Admin</h3>

		<label>
			<span class="">Email</span>
			<input type="text" class="input" placeholder="Email" />
		</label>

		<label>
			<span>Password</span>
			<input type="password" class="input" placeholder="Password" />
		</label>

		<div>
			<button class="btn btn-neutral mt-4">Login</button>
		</div>
	</form>
</div>
