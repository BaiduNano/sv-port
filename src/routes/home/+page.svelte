<script lang="ts">
    import Portrait from "./portrait/portrait.svelte";
    import Contact from "./contact/contact.svelte";
    import ViewPorto from "./viewPorto/viewPorto.svelte";
    import Commission from "./commission/commission.svelte";
</script>

<div
    class="absolute inset-0 flex justify-center h-full text-lg flex-col items-center gap-2"
>
    <Portrait />
    <div class="h-16"></div>
    <Contact />
    <div class="h-8"></div>
    <ViewPorto />
    <Commission />
</div>
