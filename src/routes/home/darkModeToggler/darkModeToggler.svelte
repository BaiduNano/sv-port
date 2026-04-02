<script lang="ts">
	import { onMount } from 'svelte';
	import { darkMode } from '$lib/store/store';

	let isDark = $state(false);

	function toggleTheme() {
		document.body.classList.toggle('dark');
		isDark = document.body.classList.contains('dark');
		darkMode.set(isDark);
	}

	onMount(() => {
		darkMode.subscribe((val) => {
			isDark = val;
			if (val) {
				document.body.classList.add('dark');
			} else {
				document.body.classList.remove('dark');
			}
		});
	});
</script>

<span class="absolute top-0 right-0 p-8 opacity-50 text-sm">
	<button
		class="flex flex-row gap-2 justify-center items-center w-auto h-8 pl-4 pr-4 cursor-pointer border rounded-full hover:bg-gray-500"
		onclick={toggleTheme}
	>
		<i class="nf {isDark ? 'nf-fa-moon' : 'nf-oct-sun'}"></i>
		<p>{isDark ? 'Dark' : 'Light'} Mode</p>
	</button>
</span>
