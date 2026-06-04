<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import DropDown from "$lib/components/dropDown.svelte";

    let show = $state(false);
</script>

<Button
    onclick={(event: MouseEvent) => {
        event.stopPropagation();
        show = !show;
    }}
    class=""
>
    <i class="nf nf-md-card_multiple"></i>
    <p>View My Works</p>
</Button>

<DropDown bind:show />
