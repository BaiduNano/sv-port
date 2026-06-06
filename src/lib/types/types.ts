export interface PortfolioItem {
    id: number | string;
    title: string;
    description: string;
    image_url: string;
    created_at?: string;
    externals: Record<string, string>;
    center?: string;
}
