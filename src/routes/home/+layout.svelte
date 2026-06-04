<script lang="ts">
    import { darkMode } from "$lib/store/store";
    import Particles from "$lib/components/particles.svelte";
    import DarkModeToggler from "./darkModeToggler/darkModeToggler.svelte";
    import "../layout.css";
    import "../icons.css";

    let { children } = $props();
</script>

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
