<script lang="ts">
    import "../layout.css";
    import "../icons.css";
    import { darkMode } from "$lib/store/store";
    import { name as title } from "$lib/socialLinks/socialLinks";
    import Particles from "$lib/components/particles.svelte";
    import DarkModeToggler from "./darkModeToggler/darkModeToggler.svelte";
    let description = "BaiduNano's personal website.";
    let url = "https://baidunano.my/home";
    let imageUrl =
        "https://isexuebuwdjrzpwwssal.supabase.co/storage/v1/object/public/portfolio-images/ss.png";
    let { children } = $props();
</script>

<svelte:head>
    <title>{title}</title>
    <link
        rel="stylesheet"
        href="https://www.nerdfonts.com/assets/css/webfont.css"
    />
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageUrl} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageUrl} />
</svelte:head>

<div
    class="bg-base-300 text-base-content duration-200 w-screen h-screen relative overflow-hidden"
>
    <Particles
        className="absolute inset-0 w-screen h-screen"
        color={$darkMode ? "#c9cbd0" : "#1c1c29"}
        size={0.8}
        refresh={true}
    />
    <DarkModeToggler />
    {@render children()}
</div>
