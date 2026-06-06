<script lang="ts">
    import { fade, scale, fly } from "svelte/transition";
    import { darkMode } from "$lib/store/store";
    import { type PortfolioItem } from "$lib/types/types";
    import Button from "./button.svelte";
    import Particles from "./particles.svelte";
    import SpinningAnim from "$lib/components/spinningAnim.svelte";

    let {
        items = [],
        almostSquare = $bindable(false),
        currentIndex = $bindable(0),
        onClose,
    } = $props<{
        items: PortfolioItem[];
        almostSquare?: boolean;
        currentIndex?: number;
        onClose?: () => void;
    }>();

    let scaleFactor = $state(1);
    let panX = $state(0);
    let panY = $state(0);
    let isDragging = $state(false);

    let isWidthLimited = $state(false);
    let isAssetLoaded = $state(false);
    let imgRef: HTMLImageElement | null = null;

    let startX = 0;
    let startY = 0;

    // Pinch to zoom state variables
    let startTouchDist = 0;
    let initialTouchScale = 1;
    let initialPanX = 0;
    let initialPanY = 0;
    let initialFocalX = 0;
    let initialFocalY = 0;

    const currentItem = $derived<PortfolioItem | null>(
        items[currentIndex] || null,
    );

    const updateSizingConstraint = () => {
        if (!imgRef || !imgRef.parentElement) return;

        const container = imgRef.parentElement;
        const containerAspectRatio =
            container.clientWidth / container.clientHeight;
        const imageAspectRatio = imgRef.naturalWidth / imgRef.naturalHeight;
        isWidthLimited = imageAspectRatio > containerAspectRatio;
    };

    const handleImageLoad = (e: Event) => {
        imgRef = e.currentTarget as HTMLImageElement;
        updateSizingConstraint();
        isAssetLoaded = true;
    };

    /* -----------------------------------------
           MOUSE MECHANICS
        ----------------------------------------- */
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!imgRef || !imgRef.parentElement) return;

        const container = imgRef.parentElement;
        const rect = container.getBoundingClientRect();

        // Find the cursor position relative to the container's center
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        // Use a multiplier instead of fixed addition for consistent zoom speed
        const zoomMultiplier = 1.15;
        const oldScale = scaleFactor;
        let newScale = oldScale;

        if (e.deltaY < 0) {
            newScale = Math.min(oldScale * zoomMultiplier, 6);
        } else {
            newScale = Math.max(oldScale / zoomMultiplier, 0.5);
        }

        if (newScale !== oldScale) {
            panX = mouseX - (newScale / oldScale) * (mouseX - panX);
            panY = mouseY - (newScale / oldScale) * (mouseY - panY);
            scaleFactor = newScale;
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    /* -----------------------------------------
       TOUCH MECHANICS
    ----------------------------------------- */
    const getTouchDistance = (touches: TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (touches: TouchList) => {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2,
        };
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            startTouchDist = getTouchDistance(e.touches);
            initialTouchScale = scaleFactor;

            // Track initial focal point and pan so we can offset correctly as scale shifts
            if (imgRef && imgRef.parentElement) {
                const rect = imgRef.parentElement.getBoundingClientRect();
                const center = getTouchCenter(e.touches);

                initialFocalX = center.x - rect.left - rect.width / 2;
                initialFocalY = center.y - rect.top - rect.height / 2;
                initialPanX = panX;
                initialPanY = panY;
            }
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
        } else if (e.touches.length === 2 && startTouchDist > 0) {
            const currentDist = getTouchDistance(e.touches);
            const scaleRatio = currentDist / startTouchDist;
            const newScale = Math.min(
                Math.max(initialTouchScale * scaleRatio, 0.5),
                6,
            );

            if (imgRef && imgRef.parentElement) {
                const rect = imgRef.parentElement.getBoundingClientRect();
                const center = getTouchCenter(e.touches);
                const currentFocalX = center.x - rect.left - rect.width / 2;
                const currentFocalY = center.y - rect.top - rect.height / 2;

                // Adjust pan to zoom towards the original pinch center
                let newPanX =
                    initialFocalX -
                    (newScale / initialTouchScale) *
                        (initialFocalX - initialPanX);
                let newPanY =
                    initialFocalY -
                    (newScale / initialTouchScale) *
                        (initialFocalY - initialPanY);

                // Add any user drift (panning while keeping two fingers down)
                newPanX += currentFocalX - initialFocalX;
                newPanY += currentFocalY - initialFocalY;

                panX = newPanX;
                panY = newPanY;
            }

            scaleFactor = newScale;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (e.touches.length === 0) {
            isDragging = false;
            startTouchDist = 0;
        } else if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
        }
    };

    /* -----------------------------------------
       GENERAL CONTROL HANDLERS
    ----------------------------------------- */
    const next = () => {
        if (items.length <= 1) return;
        currentIndex = (currentIndex + 1) % items.length;
        resetTransforms();
    };

    const prev = () => {
        if (items.length <= 1) return;
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        resetTransforms();
    };

    const shuffle = (isNext: boolean = false) => {
        if (isNext) next();
        else prev();
    };

    const resetTransforms = () => {
        scaleFactor = 1;
        panX = 0;
        panY = 0;
        isAssetLoaded = false;
        imgRef = null;
    };

    const downloadImage = async (url: string, title: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const extension =
                blob.type.split("/")[1] ||
                url.split(".").pop()?.split("?")[0] ||
                "jpg";
            const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_");
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${safeTitle}.${extension}`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Direct download failed:", error);
            window.open(url, "_blank");
        }
    };
</script>

<svelte:window
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onresize={updateSizingConstraint}
/>

<div
    transition:fade={{ duration: 250 }}
    class="fixed inset-0 z-50 flex items-center justify-center {$darkMode
        ? 'bg-black/80'
        : 'bg-black/50'} backdrop-blur-lg p-4"
>
    {#if onClose}
        <Button
            onclick={onClose}
            roundedFull={true}
            small={true}
            primary={false}
            class="absolute top-4 right-4 z-50 p-6"
            aria-label="Close previewer"
        >
            <i class="nf nf-md-close"></i>
        </Button>
    {/if}

    <div
        transition:scale={{ duration: 300, start: 0.95 }}
        class="w-[90%] h-[90%] bg-base-300 rounded-box overflow-hidden relative flex items-center justify-center select-none shadow-xl"
        onwheel={handleWheel}
    >
        <Particles
            className="absolute inset-0 w-screen h-screen"
            color={$darkMode ? "#c9cbd0" : "#1c1c29"}
            size={0.8}
            refresh={true}
        />
        {#if currentItem}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing relative"
                style="touch-action: none;"
                onmousedown={handleMouseDown}
                ontouchstart={handleTouchStart}
                ontouchmove={handleTouchMove}
                ontouchend={handleTouchEnd}
                ontouchcancel={handleTouchEnd}
                ondblclick={resetTransforms}
            >
                {#if !isAssetLoaded}
                    <div
                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                        transition:fly={{ y: -50, duration: 300 }}
                    >
                        <SpinningAnim />
                    </div>
                {/if}

                {#key currentIndex}
                    <img
                        src={currentItem.image_url}
                        alt={currentItem.title}
                        draggable="false"
                        onload={handleImageLoad}
                        out:fade={{ duration: 150 }}
                        class="absolute object-contain pointer-events-none will-change-transform
                               {isWidthLimited
                            ? 'w-full h-auto max-h-none'
                            : 'h-full w-auto max-w-none'}"
                        style="transform: translate({panX}px, {panY}px) scale({scaleFactor}); transition: transform {isDragging
                            ? '0s'
                            : '0.2s'} ease-out;"
                    />
                {/key}
            </div>

            {#if items.length > 1 && !almostSquare}
                {#each [0, 1] as i}
                    <Button
                        onclick={() => shuffle(i === 1)}
                        ignoreHover={true}
                        primary={false}
                        small={true}
                        class="absolute top-1/2 -translate-y-1/2 z-40 pointer-events-auto p-7
                   {i === 0 ? 'left-4' : 'right-4'}"
                        ><i
                            class="text-2xl nf {i === 0
                                ? 'nf-fa-circle_arrow_left'
                                : 'nf-fa-circle_arrow_right'}"
                        ></i>
                    </Button>
                {/each}
            {/if}

            <div
                class="absolute bottom-0 left-0 right-0 pt-20 pb-6 px-6 pointer-events-none z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
            >
                {#key currentIndex}
                    <div
                        in:fly={{ y: 15, duration: 300, delay: 100 }}
                        out:fade={{ duration: 100 }}
                        class="max-w-3xl pr-20 md:pr-0 pointer-events-auto"
                    >
                        <div
                            class="flex items-baseline justify-between gap-4 mb-1"
                        >
                            <h3 class="text-xl font-bold tracking-tight">
                                {currentItem.title}
                            </h3>
                            {#if currentItem.created_at}
                                <span
                                    class="text-xs whitespace-nowrap shrink-0"
                                >
                                    {new Date(
                                        currentItem.created_at,
                                    ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                    })}
                                </span>
                            {/if}
                        </div>
                        <p
                            class="text-sm line-clamp-2 md:line-clamp-none leading-relaxed"
                        >
                            {currentItem.description}
                        </p>
                    </div>
                {/key}
                <div
                    class="absolute bottom-6 right-6 pointer-events-auto z-20 flex flex-col items-end sm:flex-row gap-2"
                >
                    {#if currentItem.externals}
                        {#each Object.entries(currentItem.externals) as [social, url]}
                            <Button
                                onclick={() => window.open(url, "_blank")}
                                primary={false}
                            >
                                <i
                                    class="text-xl nf {social === 'pixiv'
                                        ? 'icon-pixiv'
                                        : 'nf-cod-twitter'}"
                                ></i>
                            </Button>
                        {/each}
                    {/if}

                    <Button
                        onclick={() =>
                            downloadImage(
                                currentItem.image_url,
                                currentItem.title,
                            )}
                        primary={false}
                    >
                        <i class="nf nf-oct-download"></i>
                        <span class="hidden sm:inline">Download</span>
                    </Button>
                </div>
            </div>
        {:else}
            <div class="text-base-content">No items available to display.</div>
        {/if}
    </div>
</div>
