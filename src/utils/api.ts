import axios from "axios";
import { Url, Collection } from '../modal/url.modal';

export async function shortenUrl(url: string, name: string | null): Promise<Url> {
    try {
        const response = await axios.post(`${process.env.URL_SHORTENER_API}/url/shorten`, { originalUrl: url, altName: name });
        return response.data.newUrl;
    } catch (error) {
        throw new Error(handleError(error));
    }
}

export async function getCollection(collection: string,): Promise<Collection> {
    try {
        const response = await axios.get(`${process.env.URL_SHORTENER_API}/collections/${collection}`);
        return response.data.collection;
    } catch (error) {
        throw new Error(handleError(error));
    }
}

export async function createCollection(collectionName: string): Promise<Collection> {
    try {
        const response = await axios.post(`${process.env.URL_SHORTENER_API}/collections/new-collection`, { collectionName: collectionName });
        return response.data.collectionUrl;
    } catch (error) {
        throw new Error(handleError(error));
    }
}

export async function addToCollection(collectionUrl: string, originalUrl: string | null, shortUrl: string | null, altName: string | null): Promise<Url> {
    try {
        if (shortUrl == null && originalUrl == null) {
            new Error("No url specified.");
        }

        const response = await axios.patch(`${process.env.URL_SHORTENER_API}/collections/add`, { data: { collectionUrl: collectionUrl, shortUrl: shortUrl, originalUrl: originalUrl, altName: altName }});
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
}

function handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return `Axios error: ${error.response?.status} - ${error.response?.data?.error}`;
    } else {
        return `Unexpected error: ${error}`;
    }
}

