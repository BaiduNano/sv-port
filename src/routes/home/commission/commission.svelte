<script lang="ts">
    import { links } from "$lib/socialLinks/socialLinks";
    import { darkMode } from "$lib/store/store";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let visible = false;

    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <a
        href={links.vgen}
        target="_blank"
        rel="noopener noreferrer"
        class="{$darkMode
            ? 'text-success'
            : 'text-warning-content'} m-8 group z-10"
        transition:fly={{ y: 20, duration: 800, delay: 300 }}
    >
        <div
            class="flex flex-col items-center w-64 h-8 overflow-hidden text-shadow-2xs"
        >
            <p class="duration-200 group-hover:-translate-y-8">
                Looking for Commissions?
            </p>
            <p
                class="duration-200 group-hover:-translate-y-8 group-hover:underline"
            >
                Check out on VGen
            </p>
        </div>
    </a>
{/if}
