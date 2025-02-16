import { EmbedBuilder } from 'discord.js';
import { Url, Collection } from '../modal/url.modal';

export function formatUrl(url: Url): string {
    const shortUrl = `${process.env.URL_SHORTENER_REDIRECT}${url!.shortUrl}`;
    const urlName = getUrlName(url);

    return `[${urlName}](${shortUrl})`;
}

export function formatCollection(collection: Collection): object {
    const collectionUrl = `${process.env.URL_SHORTENER_REDIRECT}collections/${collection.collectionUrl}`;
    const collectionName = collection.collectionName ?? collection.collectionUrl;

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${collectionName} #${collection.collectionUrl}`)
        .setURL(collectionUrl)
        .setDescription(`Here are the URLs in the collection:`);

    if (collection.urls) {
        collection.urls.slice(0, 25).forEach((urlData, index) => {
            embed.addFields({
                name: getUrlName(urlData),
                value: formatUrl(urlData),
                inline: false,
            });
        });
    }

    return { embeds: [embed] };
}

export function formatError(errorMessage: string, error: unknown): string {
    if (error instanceof Error) {
        return `${errorMessage}: ${error.message}`;
    } else {
        return `${errorMessage}: An unknown error occurred.`;
    }
}

export function getDomain(url: string): string {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
}

function getUrlName(url: Url): string {
    return url!.altName?.trim().length > 0 ? url!.altName : url!.shortUrl;
}