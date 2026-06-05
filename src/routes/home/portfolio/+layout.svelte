<script lang="ts">
    import { fly } from "svelte/transition";
    let { children } = $props();
</script>

<span class="absolute top-0 left-0 p-8 text-sm z-1">
    <a
        href="/home"
        class="duration-200 rounded-selector shadow-xl cursor-pointer
        hover:-translate-y-px active:translate-y-px hover:bg-base-200
        bg-base-100 text-base-content hover:text-secondary hover:border-secondary border-2 border-transparent
        p-2 pl-4 pr-4 flex flex-row gap-2 items-center"
        transition:fly={{ y: -10, duration: 500 }}
    >
        <i class="nf nf-fa-arrow_circle_left"></i>
        Back to Home
    </a>
</span>

{@render children()}
