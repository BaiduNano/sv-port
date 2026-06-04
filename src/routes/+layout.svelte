<script lang="ts">
    import { name } from "$lib/socialLinks/socialLinks";
    let { children } = $props();
</script>

<svelte:head>
    <title>{name}</title>
    <link
        rel="stylesheet"
        href="https://www.nerdfonts.com/assets/css/webfont.css"
    />
</svelte:head>

{@render children()}
