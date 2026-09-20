<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { navigating } from '$app/stores';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Game {
    title: string;
    url: string;
    thumb: string;
    description: string;
    genre: string;
    platforms: string[];
  }

  const PROFILE_URL = "https://baidunano.itch.io/";

  let { data }: { data: PageData } = $props();

  let games = $state<Game[]>([]);
  let loading = $state(true);
  let errorMessage = $state<string | null>(null);
  let visible = $state(false);

  function parseItchGames(html: string): Game[] {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cells = Array.from(doc.querySelectorAll('.game_cell'));

    if (!cells.length) {
      throw new Error("No games found.");
    }

    return cells.map(cell => {
      const titleEl = cell.querySelector('.game_title a');
      const imgEl = cell.querySelector('.game_thumb img');
      const descEl = cell.querySelector('.game_text');

      const platforms = Array.from(cell.querySelectorAll('.game_platform span'))
        .map(span => {
          if (span.classList.contains('web_flag')) return "Web";
          return span.getAttribute('title')?.replace('Download for ', '') || '';
        })
        .filter(Boolean);

      return {
        title: titleEl?.textContent || 'Untitled Game',
        url: titleEl?.getAttribute('href') || PROFILE_URL,
        thumb: imgEl?.getAttribute('data-lazy_src') || imgEl?.getAttribute('src') || '',
        description: descEl?.getAttribute('title') || descEl?.textContent || '',
        genre: cell.querySelector('.game_genre')?.textContent || '',
        platforms
      };
    });
  }

  onMount(() => {
    visible = true;
    try {
      if (!data.rawHtml) throw new Error("Failed to load data.");
      games = parseItchGames(data.rawHtml);
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      loading = false;
    }
  });

  const unsubscribe = navigating.subscribe((nav) => {
    if (!nav) return;
    if (nav.to?.route.id !== "/home/portfolio/games") {
      visible = false;
    }
  });

  onDestroy(() => unsubscribe());
</script>

{#if visible}
  <div class="w-full h-full overflow-y-auto font-sans text-base-content" transition:fade={{ duration: 250 }}>
    <div class="min-h-full flex flex-col lg:justify-center px-5 pt-[100px] pb-20 lg:py-20">
      <div class="w-full max-w-7xl mx-auto">
        {#if loading}
          {@render statusBox("Loading games...", true)}
        {:else if errorMessage}
          {@render statusBox(errorMessage, false, true)}
        {:else if games.length === 0}
          {@render statusBox("No games found.")}
        {:else}
          <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {#each games as game}
              {@render gameCard(game)}
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#snippet statusBox(message: string, isSpinning = false, isError = false)}
  <div class="flex items-center justify-center gap-3 p-10 rounded-xl bg-base-200 border border-base-300 {isError ? 'text-error' : 'text-base-content'}">
    {#if isSpinning}
      <div class="w-5 h-5 border-4 border-base-300 border-t-primary rounded-full animate-spin"></div>
    {/if}
    <p class="font-medium">{message}</p>
  </div>
{/snippet}

{#snippet gameCard(game: Game)}
  <a href={game.url} target="_blank" rel="noopener noreferrer" class="group flex flex-col bg-base-100 rounded-xl overflow-hidden border border-base-300 text-base-content no-underline shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-primary">
    <div class="relative overflow-hidden bg-base-300 aspect-[315/250]">
      {#if game.thumb}
        <img src={game.thumb} alt={game.title} loading="lazy" class="w-full h-full object-cover" />
      {:else}
        <div class="flex items-center justify-center h-full opacity-50 text-sm">No Image</div>
      {/if}
    </div>

    <div class="p-4 flex flex-col gap-2.5">
      <h3 class="m-0 text-[1.15rem] font-bold text-primary">{game.title}</h3>

      <div class="flex flex-wrap gap-1.5">
        {#if game.genre}
          <span class="text-[0.7rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-primary text-primary-content">
            {game.genre}
          </span>
        {/if}
        {#each game.platforms as platform}
          <span class="text-[0.7rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-base-200 text-base-content">
            {platform}
          </span>
        {/each}
      </div>

      {#if game.description}
        <p class="m-0 text-sm opacity-80 leading-tight line-clamp-2">{game.description}</p>
      {/if}
    </div>
  </a>
{/snippet}
