import { redirect } from "@sveltejs/kit";
import { links } from "$lib/socialLinks/socialLinks";

export function load() {
    throw redirect(307, links.vgen);
}
