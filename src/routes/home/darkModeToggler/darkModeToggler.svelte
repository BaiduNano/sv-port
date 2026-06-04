<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { onMount } from "svelte";
    import { darkMode } from "$lib/store/store";

    let isDark = $state(false);

    const toggleTheme = () => {
        document.body.classList.toggle("dark");
        isDark = document.body.classList.contains("dark");
        darkMode.set(isDark);
    };

    onMount(() => {
        darkMode.subscribe((val) => {
            isDark = val;
            if (val) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        });
    });
</script>

<span class="absolute top-0 right-0 p-8 text-sm z-1">
    <Button onclick={toggleTheme} small={true} primary={false}>
        <i class="nf {isDark ? 'nf-fa-moon' : 'nf-oct-sun'}"></i>
        <p>{isDark ? "Dark" : "Light"} Mode</p>
    </Button>
</span>
