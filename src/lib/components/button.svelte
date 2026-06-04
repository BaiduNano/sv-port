<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let {
        type = "button",
        onclick,
        children,
        class: classNameProp,
        ...restProps
    } = $props();

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    <button
        class="duration-200 rounded-selector bg-base-100 border-2 border-transparent hover:text-secondary hover:bg-base-200 hover:border-secondary shadow-xl flex flex-row gap-2 justify-center items-center w-auto h-9 pl-4 pr-4 cursor-pointer {classNameProp}"
        {onclick}
        in:fly={{ y: -10, duration: 800, delay: 100 }}
    >
        {@render children()}
    </button>
{/if}
