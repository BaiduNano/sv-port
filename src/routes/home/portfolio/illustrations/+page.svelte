<script lang="ts">
    import { onMount } from "svelte";
    import { navigating } from "$app/stores";
    import { supabase } from "$lib/supabase/supabase";
    import { fade } from "svelte/transition";

    import type { PortfolioItem } from "$lib/types/types";
    import ImageGrid from "$lib/components/imageGrid.svelte";
    import SpinningAnim from "$lib/components/spinningAnim.svelte";
    import ImagePreviewer from "$lib/components/imagePreviewer.svelte";

    let portfolioItems = $state<PortfolioItem[]>([]);
    let isLoading = $state<boolean>(true);
    let errorMessage = $state<string | null>(null);
    let visible = $state(false);
    let previewIndex = $state(-1);

    let optimizedItems = $derived(
        portfolioItems.map((item) => {
            const isSupabaseStorage = item.image_url.includes(
                "supabase.co/storage/v1/object/public",
            );

            return {
                ...item,
                image_url: isSupabaseStorage
                    ? `${item.image_url}?width=600&quality=80&format=webp`
                    : item.image_url,
            };
        }),
    );

    onMount(async () => {
        visible = true;
        try {
            const { data, error } = await supabase
                .from("portfolio")
                .select("*");
            if (error) throw error;
            portfolioItems = (data as PortfolioItem[]) || [];
        } catch (err: any) {
            errorMessage = err.message;
        } finally {
            isLoading = false;
        }
    });

    navigating.subscribe((nav) => {
        if (!nav) return;
        if (nav.to?.route.id !== "/home/portfolio/illustrations") {
            visible = false;
            previewIndex = -1;
        }
    });
</script>

{#if visible}
    <div
        class="flex h-screen w-screen items-center justify-center pt-26 pb-8 pl-16 pr-16 backdrop-blur-xs"
        out:fade
    >
        {#if isLoading}
            <div class="w-full h-full flex items-center justify-center z-10">
                <SpinningAnim />
            </div>
        {:else if errorMessage}
            <h1>Whoops, something went wrong.</h1>
            <p class="text-error">{errorMessage}</p>
        {:else}
            <ImageGrid
                portfolioItems={optimizedItems}
                onItemClick={(index) => (previewIndex = index)}
            />
        {/if}
    </div>
{/if}

{#if previewIndex >= 0}
    <ImagePreviewer
        items={portfolioItems}
        bind:currentIndex={previewIndex}
        onClose={() => (previewIndex = -1)}
    />
{/if}
