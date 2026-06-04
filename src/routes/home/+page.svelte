<script lang="ts">
    import Particles from "$lib/components/particles.svelte";
    import { darkMode } from "$lib/store/store";

    import DarkModeToggler from "./darkModeToggler/darkModeToggler.svelte";
    import Portrait from "./portrait/portrait.svelte";
    import Contact from "./contact/contact.svelte";
    import Email from "./email/email.svelte";
    import Commission from "./commission/commission.svelte";
    import { name } from "$lib/socialLinks/socialLinks";
</script>

<svelte:head>
    <title>{name}</title>
    <link
        rel="stylesheet"
        href="https://www.nerdfonts.com/assets/css/webfont.css"
    />
</svelte:head>

<div class="bg-base-300 text-base-content duration-200 w-screen h-screen">
    <Particles
        className="absolute inset-0"
        color={$darkMode ? "#ffffff" : "#000000"}
        size={0.8}
        refresh={true}
    />
    <div class="flex justify-center h-full text-lg flex-col items-center gap-2">
        <DarkModeToggler />
        <Portrait />
        <div class="h-16"></div>
        <p>Contact</p>
        <Contact />
        <div class="h-8"></div>
        <Email />
        <Commission />
    </div>
</div>
