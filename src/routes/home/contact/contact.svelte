<script lang="ts">
    import { links } from "$lib/socialLinks/socialLinks";
    import { onMount } from "svelte";

    const contact = [
        { icon: "icon-pixiv", name: "Pixiv", url: links.pixiv },
        //{ icon: 'nf-fae-butterfly', name: 'BlueSky', url: links.bluesky },
        { icon: "icon-fanbox", name: "Fanbox", url: links.fanbox },
        { icon: "nf-cod-twitter", name: "Twitter", url: links.twitter },
        { icon: "nf-cod-kebab_vertical", name: "", url: "" },
        { icon: "nf-fa-itch_io", name: "Itch.io", url: links.itchio },
        { icon: "nf-fa-github", name: "GitHub", url: links.github },
    ];

    let fontsLoaded = $state(false);

    onMount(() => {
        if (!("fonts" in document)) {
            fontsLoaded = true;
            return;
        }
        document.fonts.ready.then(() => {
            fontsLoaded = true;
        });
    });
</script>

<span class="flex flex-row">
    {#each contact as c}
        <div
            class="relative flex flex-col justify-center items-center group text-4xl"
        >
            {#if c.icon.startsWith("nf-") && !fontsLoaded}
                <div
                    class="absolute inset-0 m-auto h-7 w-7 border-2 border-gray-500 border-t-transparent rounded-full animate-spin opacity-50"
                ></div>
            {/if}

            {#if !c.name}
                <i
                    class="nf {c.icon} relative z-10 opacity-50"
                    aria-hidden="true"
                ></i>
            {:else}
                <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="relative p-2 duration-200 z-10 group-hover:text-blue-400"
                    aria-label={c.name}
                >
                    <i
                        class={c.icon.startsWith("nf-")
                            ? "nf " + c.icon
                            : c.icon}
                        aria-hidden="true"
                    ></i>
                </a>
                <span
                    class="absolute text-lg z-0 mt-18 pointer-events-none opacity-0 duration-200 group-hover:opacity-50 group-hover:mt-20"
                    >{c.name}
                </span>
            {/if}
        </div>
    {/each}
</span>
