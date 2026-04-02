import { writable } from 'svelte/store'
import { browser } from '$app/environment'

const storedValue = browser ? localStorage.getItem("darkMode") : null;
const initialValue = storedValue === null ? true : storedValue === "true";

export const darkMode = writable<boolean>(initialValue);

darkMode.subscribe((val) => {
    if (browser) {
        localStorage.setItem("darkMode", String(val));
    }
})
