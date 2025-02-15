import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { createCollection, getCollection, addToCollection } from "../utils/api";
import { formatCollection, formatError } from "../utils/data.format";
import { handleReplyOrFollowup, handleReplyOrFollowupObject } from "../utils/discordHelpers";

const getCollectionCommand = new SlashCommandBuilder()
    .setName("collection")
    .setDescription("Get a collection")
    .addStringOption(option =>
        option.setName("collection")
            .setDescription("Url of the collection")
            .setRequired(true)
    );

const createCollectionCommand = new SlashCommandBuilder()
    .setName("cc")
    .setDescription("Create a new collection")
    .addStringOption(option =>
        option.setName("name")
            .setDescription("Name of new collection")
            .setRequired(true)
    );

const addToCollectionCommand = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a new or existing url to a collection")
    .addStringOption(option =>
        option.setName("collection")
            .setDescription("Url of the collection")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("urlshort")
            .setDescription("Shortened url of already shortened url to add")
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("url")
            .setDescription("New url to add")
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("urlname")
            .setDescription("Name of new url")
            .setRequired(false)
    );

async function executeGetCollection(interaction: ChatInputCommandInteraction) {
    const collection = interaction.options.getString("collection", true);
    try {
        const collectionData = await getCollection(collection);
        await handleReplyOrFollowupObject(interaction, formatCollection(collectionData));
    }
    catch (error) {
        throw new Error(formatError(`There was an error trying get collection ${collection}`, error));
    }

}

async function executeCreateCollection(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name", true);
    try {
        const collectionData = await createCollection(name);
        await handleReplyOrFollowupObject(interaction, formatCollection(collectionData));
    }
    catch (error) {
        throw new Error(formatError(`There was an error trying creating a new collection`, error));
    }

}

async function executeAddToCollection(interaction: ChatInputCommandInteraction) {
    const collection = interaction.options.getString("collection", true);
    const urlShort = interaction.options.getString("urlshort", false);
    const url = interaction.options.getString("url", false);
    const urlName = interaction.options.getString("urlname", false);
    try {
        const urlData = await addToCollection(collection, url, urlShort, urlName);
        await handleReplyOrFollowup(interaction, `Url (${urlData?.altName ?? urlData?.shortUrl ?? url ?? urlShort}) added to collection (${collection}) successfully.`, true);
    }
    catch (error) {
        throw new Error(formatError(`There was an error adding the url ${(url && url.trim().length > 0) ? url : urlName ?? urlShort } to the collection ${collection}`, error));
    }
}

export {
    getCollectionCommand,
    createCollectionCommand,
    addToCollectionCommand,

    executeGetCollection,
    executeCreateCollection,
    executeAddToCollection,
};
