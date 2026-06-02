<script lang="ts">
	import portrait from '$lib/assets/portrait/portrait.webp';
	import { name } from '$lib/socialLinks/socialLinks';
</script>

<div class="h-46 w-46">
	<img src={portrait} alt="Portrait of {name}" class="rounded-full" />
</div>
<h1 class="font-bold text-center text-3xl pt-1">{name}</h1>
