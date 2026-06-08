<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import type { PortfolioItem } from "$lib/types/types";
    import Button from "$lib/components/button.svelte";
    import SpinningAnim from "./spinningAnim.svelte";

    // Destructure props, adding the onItemClick callback for Svelte 5
    let {
        portfolioItems,
        onItemClick,
        almostSquare = $bindable(false),
    } = $props<{
        portfolioItems: PortfolioItem[];
        onItemClick: (index: number) => void;
        almostSquare: boolean;
    }>();

    let scrollContainer: HTMLElement | null = null;
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let loadedImages = $state<Record<string, boolean>>({});
    let visible = $state(false);

    let aspectRatio = $derived(innerWidth / (innerHeight || 1));
    let isSquareIsh = $derived(aspectRatio <= 1.35);
    let itemsToShow = $derived(isSquareIsh ? 3 : 4);

    let isPortrait = $derived(innerWidth < innerHeight);
    let itemSize = $derived(
        itemsToShow === 3 ? "calc(33.333% - 0.5rem)" : "calc(25% - 0.5625rem)",
    );

    const cardClass =
        "absolute inset-0 w-full h-full object-cover ease-in-out rounded-box duration-200 pointer-events-none";

    const getScrollStep = (): { x: number; y: number } => {
        const firstChild = scrollContainer?.firstElementChild as HTMLElement;
        const style = window.getComputedStyle(scrollContainer as HTMLElement);
        const gap = parseFloat(style.gap) || 0;
        return {
            x: firstChild.offsetWidth + gap,
            y: firstChild.offsetHeight + gap,
        };
    };

    const scroll = (next: boolean = false) => {
        if (scrollContainer) {
            const step = getScrollStep();
            if (isPortrait) {
                scrollContainer.scrollBy({
                    top: next ? step.y : -step.y,
                    behavior: "smooth",
                });
            } else {
                scrollContainer.scrollBy({
                    left: next ? step.x : -step.x,
                    behavior: "smooth",
                });
            }
        }
    };

    const wheelScroll = (node: HTMLElement, isPortraitLayout: boolean) => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                if (isPortraitLayout) {
                    node.scrollBy({ top: e.deltaY, behavior: "auto" });
                } else {
                    node.scrollBy({ left: e.deltaY, behavior: "auto" });
                }
            }
        };
        node.addEventListener("wheel", handleWheel, { passive: false });
        return {
            update(newIsPortrait: boolean) {
                isPortraitLayout = newIsPortrait;
            },
            destroy() {
                node.removeEventListener("wheel", handleWheel);
            },
        };
    };

    onMount(() => {
        visible = true;
    });
    $effect(() => {
        almostSquare = isSquareIsh;
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div
    class="flex w-full h-full gap-3 scroll-smooth snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            {isPortrait
        ? 'h-full flex-col overflow-x-hidden overflow-y-auto snap-y'
        : 'w-full flex-row overflow-x-auto overflow-y-hidden snap-x'}"
    bind:this={scrollContainer}
    use:wheelScroll={isPortrait}
>
    {#each portfolioItems as item, index}
        {#if visible}
            <a
                href={item.image_url}
                onclick={(e) => {
                    e.preventDefault();
                    onItemClick(index);
                }}
                transition:fly={{ y: 50, duration: 600, delay: index * 100 }}
                class="shadow-lg shrink-0 snap-start relative flex items-center justify-center rounded-box overflow-hidden group cursor-pointer"
                style={isPortrait
                    ? `width: 100%; height: ${itemSize};`
                    : `height: 100%; width: ${itemSize};`}
            >
                {#if !loadedImages[item.id]}
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-base-100 animate-pulse z-20"
                    >
                        <SpinningAnim />
                    </div>
                {/if}

                <img
                    src={item.image_url}
                    alt="Gallery item {index}"
                    draggable="false"
                    loading={index < itemsToShow ? "eager" : "lazy"}
                    decoding="async"
                    onload={() => (loadedImages[item.id] = true)}
                    class="{cardClass} z-10 {loadedImages[item.id]
                        ? 'group-hover:scale-99'
                        : ''}"
                    style="object-position: {item.center || 'center'};"
                />

                {#if loadedImages[item.id]}
                    <div
                        class="{cardClass} {loadedImages[item.id]
                            ? 'group-hover:scale-99'
                            : ''} flex flex-col p-4 z-20"
                    >
                        <span
                            class="shadow-sm bg-[#0000005a] backdrop-blur-lg text-white w-fit px-4 py-2 rounded-box inline-flex flex-row gap-2 items-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                        >
                            <i class="nf nf-fa-paint_brush"></i>
                            <p class="pointer-events-none m-0">
                                {item.title}
                            </p>
                        </span>
                    </div>
                {/if}
            </a>
        {/if}
    {/each}
</div>

{#each [0, 1] as i}
    <Button
        small={true}
        primary={false}
        roundedFull={true}
        class="absolute z-20 p-7
            {isPortrait
            ? i === 0
                ? 'top-18 left-1/2 -translate-x-1/2'
                : 'bottom-0 left-1/2 -translate-x-1/2'
            : i === 0
              ? 'left-8 top-1/2'
              : 'right-8 top-1/2'}"
        onclick={() => scroll(i === 1)}
        aria-label={i === 1 ? "Scroll next" : "Scroll previous"}
    >
        <i
            class="text-2xl nf {i === 1
                ? isPortrait
                    ? 'nf-fa-arrow_circle_down'
                    : 'nf-fa-arrow_circle_right'
                : isPortrait
                  ? 'nf-fa-arrow_circle_up'
                  : 'nf-fa-arrow_circle_left'}"
        ></i>
    </Button>
{/each}
