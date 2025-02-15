export interface Url {
    shortUrl: string;
    altName: string;
}

export interface Collection {
    collectionUrl: string;
    collectionName: string;
    urls?: Url[];
    viewCount: number;
    upCount: number;
    downCount: number;
    createdAt: string;
    updatedAt: string;
}