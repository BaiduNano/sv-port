<script>
    import { onMount } from "svelte";

    const links = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=jAGCnOi3gt0",
        "https://www.youtube.com/watch?v=FumbPNRKTs8",
        "https://www.youtube.com/watch?v=uZeXQeyv-VE",
        "https://www.youtube.com/watch?v=TGNvRJX3Gu8",
        "https://www.youtube.com/watch?v=54yKPwskCBg",
        "https://www.youtube.com/watch?v=Zh6J2b2MZHw",
        "https://www.youtube.com/watch?v=L2orcrXZDoM",
        "https://www.youtube.com/watch?v=IVwJqEXWSOQ",
        "https://www.youtube.com/watch?v=biUwIqFr4FM",
        "https://www.youtube.com/watch?v=K0RcYkFY-YE",
        "https://www.youtube.com/watch?v=1xtFp2Wu_To",
        "https://www.youtube.com/watch?v=3hVXt9NYiJA",
        "https://www.youtube.com/watch?v=p-v1Hn_aZHA",
        "https://www.youtube.com/watch?v=EHpUtZ7yiYc",
        "https://www.youtube.com/watch?v=ERCqmI3WLKQ",
        "https://www.youtube.com/watch?v=BJLFfkGHWUU",
        "https://www.youtube.com/watch?v=oOIztBXox60",
        "https://www.youtube.com/shorts/z9Bp-4yIMvI",
        "https://www.youtube.com/shorts/UYMCPfkS5Gs",
        "https://www.youtube.com/watch?v=7dS5y4rJG04",
    ];

    onMount(() => {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        window.location.href = randomLink;
    });
</script>
