<script lang="ts">
    import { links } from "$lib/socialLinks/socialLinks";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    const contact = [
        { icon: "icon-pixiv", name: "Pixiv", url: links.pixiv },
        { icon: "icon-fanbox", name: "Fanbox", url: links.fanbox },
        { icon: "nf-cod-twitter", name: "Twitter", url: links.twitter },
        { icon: "nf-cod-kebab_vertical", name: "", url: "" },
        { icon: "nf-fa-itch_io", name: "Itch.io", url: links.itchio },
        { icon: "nf-fa-github", name: "GitHub", url: links.github },
    ];

    let fontsLoaded = $state(false);
    let visible = $state(false);

    onMount(() => {
        visible = true;
        if (!("fonts" in document)) {
            fontsLoaded = true;
            return;
        }
        document.fonts.ready.then(() => {
            fontsLoaded = true;
        });
    });
</script>

{#if visible}
    <p transition:fly={{ y: 10, duration: 800 }}>Contact</p>
{/if}
<span class="flex flex-row gap-2">
    {#each contact as c, i}
        {#if visible}
            <div
                class="relative flex flex-col justify-center items-center group text-3xl"
                transition:fly={{ y: 20, duration: 800, delay: i * 100 }}
            >
                <!-- Loading Bar -->
                {#if c.icon.startsWith("nf-") && !fontsLoaded}
                    <div
                        class="absolute inset-0 m-auto h-7 w-7 border-2 border-base-content border-t-transparent rounded-full animate-spin opacity-50"
                    ></div>
                {/if}
                <!-- triple dot -->
                {#if !c.name}
                    <i class="nf {c.icon} relative" aria-hidden="true"></i>
                {:else}
                    <!-- Icon button -->
                    <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="duration-200 bg-base-100 p-2 pl-3 pr-3 rounded-box shadow-xl border-2 border-transparent group-hover:bg-base-200 group-hover:border-secondary group-hover:text-secondary group-hover:-translate-y-px group-active:translate-y-px"
                        aria-label={c.name}
                    >
                        <i
                            class={c.icon.startsWith("nf-")
                                ? "nf " + c.icon
                                : c.icon}
                            aria-hidden="true"
                        ></i>
                    </a>
                    <!-- Icon name -->
                    <span
                        class="duration-200 absolute text-sm text-secondary mt-20 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:mt-22"
                        >{c.name}
                    </span>
                {/if}
            </div>
        {/if}
    {/each}
</span>
