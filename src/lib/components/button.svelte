<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let {
        type = "button",
        small = false,
        primary = true,
        onclick,
        children,
        class: classNameProp,
        ...restProps
    } = $props();

    let visible = $state(false);
    const delay = Math.random() * 500;

    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <button
        class="z-10 duration-200 rounded-selector border-2
        shadow-xl flex flex-row gap-2 justify-center items-center w-auto cursor-pointer hover:bg-base-200
        hover:-translate-y-px active:translate-y-px p-2
        {primary
            ? 'bg-base-300 border-primary text-primary hover:text-secondary hover:border-secondary'
            : 'bg-base-100 border-transparent hover:text-secondary hover:border-secondary'}
        {small ? 'h-9 pl-4 pr-4 ' : 'h-12 pl-6 pr-6 '} {classNameProp}"
        {onclick}
        transition:fly={{ y: -10, duration: 800, delay: delay }}
    >
        {@render children()}
    </button>
{/if}
