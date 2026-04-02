<script lang="ts">
	import DarkModeToggler from './darkModeToggler/darkModeToggler.svelte';
	import Portrait from './portrait/portrait.svelte';
	import Contact from './contact/contact.svelte';
	import Email from './email/email.svelte';
	import Commission from './commission/commission.svelte';
	import { name } from '$lib/socialLinks/socialLinks';
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>

<div class="theme-text theme-bg duration-200 w-screen h-screen">
	<div class="flex justify-center h-full text-lg flex-col items-center gap-2">
		<DarkModeToggler />
		<Portrait />
		<div class="h-16"></div>
		<span class="opacity-50">Contact</span>
		<Contact />
		<div class="h-8"></div>
		<Email />
		<Commission />
	</div>
</div>
