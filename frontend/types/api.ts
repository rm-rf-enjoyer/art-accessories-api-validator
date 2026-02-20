export interface Product {
    id: number;
    title: string;
    price: number;
    image_url: string;
    article?: string;
    rating?: number;
}

export interface SearchResponse {
    success: boolean;
    data: Product[];
    total: number;
}