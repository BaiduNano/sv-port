<script lang="ts">
    import { onMount } from "svelte";
    import { scale, fade } from "svelte/transition"; // Added fade for a smooth backdrop transition
    import { darkMode } from "$lib/store/store";

    export let show = false;
    let menu: HTMLElement | null = null;

    onMount(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (show && menu && !menu.contains(event.target as HTMLElement)) {
                show = false;
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (show && event.key === "Escape") {
                show = false;
            }
        };

        document.addEventListener("click", handleOutsideClick, false);
        document.addEventListener("keyup", handleEscape, false);

        return () => {
            document.removeEventListener("click", handleOutsideClick, false);
            document.removeEventListener("keyup", handleEscape, false);
        };
    });

    const items = [
        {
            href: "/home/portfolio/illustrations",
            label: "Illustrations",
            icon: "nf-fa-picture_o",
        },
        {
            href: "/home/portfolio/games",
            label: "Game Projects",
            icon: "nf-md-google_controller",
        },
        {
            href: "/home/portfolio/others",
            label: "Other Projects",
            icon: "nf-md-file_code",
        },
    ];
</script>

<div class="relative" bind:this={menu}>
    {#if show}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
            transition:fade={{ duration: 150 }}
            class="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs"
            on:click={() => (show = false)}
        ></div>

        <div
            in:scale={{ duration: 100, start: 0.95 }}
            out:scale={{ duration: 75, start: 0.95 }}
            class="absolute bottom-full left-1/2 -translate-x-1/2 w-64 mb-18 z-50
                   shadow-xl bg-base-100 border-neutral rounded-box overflow-hidden
                   {$darkMode ? 'border-2' : 'border-0'}"
        >
            {#each items as item}
                <a
                    href={item.href}
                    class="block px-4 py-3 hover:bg-primary hover:text-primary-content"
                >
                    <span class="flex items-center gap-3">
                        <i class="nf {item.icon}"></i>
                        <p>{item.label}</p>
                    </span>
                </a>
                {#if item !== items[items.length - 1]}
                    <hr class="border-neutral" />
                {/if}
            {/each}
        </div>
    {/if}
</div>
