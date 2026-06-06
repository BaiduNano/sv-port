<script lang="ts">
    import { name as title } from "$lib/socialLinks/socialLinks";
    let { children } = $props();

    let description = "BaiduNano's personal website.";
    let url = "https://baidunano.my/home";
    let imageUrl =
        "https://isexuebuwdjrzpwwssal.supabase.co/storage/v1/object/public/portfolio-images/ss.png";
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

{@render children()}
