<script lang="ts">
    import { fly } from "svelte/transition";
</script>

<div
    transition:fly={{ y: 10, duration: 800 }}
    class="absolute inset-0 w-full h-full flex items-center justify-center flex-col gap-4"
>
    <h1>Sorry, this page is under construction.</h1>
    <img
        src="https://media.tenor.com/S4rDip1aAJsAAAAj/troll-hehe.gif"
        alt=""
        width="64"
    />
</div>
