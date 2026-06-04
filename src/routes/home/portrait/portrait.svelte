<script lang="ts">
    import portrait from "$lib/assets/portrait/portrait.webp";
    import { name } from "$lib/socialLinks/socialLinks";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <div
        class="h-46 w-46 z-10 rounded-full border-2 border-primary shadow-xl p-2"
        in:fly={{ y: -10, duration: 800 }}
    >
        <img src={portrait} alt={name} class="rounded-full" />
    </div>
{/if}
<h1 class="font-bold text-center text-3xl pt-1">{name}</h1>
