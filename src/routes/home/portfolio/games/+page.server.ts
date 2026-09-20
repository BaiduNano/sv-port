import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const res = await fetch('https://baidunano.itch.io/');
    const rawHtml = await res.text();

    return {
        rawHtml
    };
};
