<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase/supabase";
    import type { PortfolioItem } from "$lib/types/types";

    // Svelte 5 Typed State Runes
    let portfolioItems = $state<PortfolioItem[]>([]);
    let isLoading = $state<boolean>(true);
    let errorMessage = $state<string | null>(null);

    // Track loading state for individual images by ID
    let loadedImages = $state<Record<string, boolean>>({});

    // Automatically compute optimized URLs whenever portfolioItems changes
    let optimizedItems = $derived(
        portfolioItems.map((item) => {
            // Check if it's a Supabase storage URL to avoid breaking external links
            const isSupabaseStorage = item.image_url.includes(
                "supabase.co/storage/v1/object/public",
            );

            return {
                ...item,
                // Append Supabase transformation parameters if applicable
                optimizedUrl: isSupabaseStorage
                    ? `${item.image_url}?width=600&quality=80&format=webp`
                    : item.image_url,
            };
        }),
    );

    onMount(async () => {
        try {
            const { data, error } = await supabase
                .from("portfolio")
                .select("*");

            if (error) throw error;

            portfolioItems = (data as PortfolioItem[]) || [];

            portfolioItems.forEach((item) => {
                loadedImages[item.id] = false;
            });
        } catch (err: any) {
            errorMessage = err.message || "Failed to fetch portfolio data.";
        } finally {
            isLoading = false;
        }
    });
</script>

<header class="biodata">
    <h1>My Illustration Portfolio</h1>
    <p>
        Welcome to my gallery. Completely read-only and secured via Supabase
        RLS.
    </p>
</header>

<hr />

<main>
    {#if isLoading}
        <p>Loading your amazing illustrations...</p>
    {:else if errorMessage}
        <p class="error">Error: {errorMessage}</p>
    {:else}
        <div class="gallery">
            {#each optimizedItems as item (item.id)}
                <div class="card">
                    <div class="image-container">
                        {#if !loadedImages[item.id]}
                            <div class="skeleton-shimmer"></div>
                        {/if}

                        <img
                            src={item.optimizedUrl}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            class:loaded={loadedImages[item.id]}
                            onload={() => (loadedImages[item.id] = true)}
                        />
                    </div>

                    <h2>{item.title}</h2>
                    <p>{item.description}</p>

                    {#if item.metadata?.tags}
                        <div class="tags">
                            {#each item.metadata.tags as tag}
                                <span class="tag">#{tag}</span>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    /* CSS remains exactly the same as the previous response */
    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        padding: 1rem 0;
    }
    .card {
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
    .image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 10;
        border-radius: 8px;
        overflow: hidden;
        background: #f6f7f8;
        margin-bottom: 1rem;
    }
    .card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    .card img.loaded {
        opacity: 1;
    }
    .skeleton-shimmer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
    }
    @keyframes loading-shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
    .error {
        color: #ff3e3e;
        font-weight: bold;
    }
    .tag {
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-right: 0.5rem;
    }
</style>
