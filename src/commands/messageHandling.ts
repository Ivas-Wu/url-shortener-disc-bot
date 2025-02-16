import { ChatInputCommandInteraction, Collection, Message, MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";
import { fetchMessages, handleReplyOrFollowup, handleReplyOrFollowupObject } from "../utils/discordHelpers";
import validator from 'validator';
import { addToCollection, createCollection, getCollection } from "../utils/api";
import { formatCollection, formatError } from "../utils/data.format";

const clearBotMessagesCommand = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete bot messages")
    .addStringOption(option =>
        option.setName("time")
            .setDescription("Time in minutes (default: 10, max: 600)")
            .setRequired(false)
    );

const condenseChatMessagesCommand = new SlashCommandBuilder()
    .setName("grab")
    .setDescription("Get url messages and add them to a collection")
    .addStringOption(option =>
        option.setName("time")
            .setDescription("Time in minutes (default: 10, max: 600)")
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("collection")
            .setDescription("Collection to add to (default: new collection will be created)")
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("delete")
            .setDescription("Delete the original message (Y/N) (default: Y)")
            .setRequired(false)
    );

async function executeClearBotMessages(interaction: ChatInputCommandInteraction) {
    const time: number = Number(interaction.options.getString("time", false)) == 0 ? 10 : Number(interaction.options.getString("time", false));

    if (time > 600) {
        throw new Error(`Value provided was greater than max allowed`);
    }

    const channel = interaction.channel as TextChannel;
    if (!channel) {
        throw new Error(`This command can only be used in text channels`);
    }

    const now = Date.now();
    const timeLimit = now - time * 60 * 1000;

    let fetchedMessages: Collection<string, Message>;
    let messagesToDelete: Collection<string, Message> = new Collection();

    let lastMessageId: string | undefined = undefined;
    let continueFetching: boolean = true;

    do {
        try {
            fetchedMessages = await fetchMessages(interaction, channel, lastMessageId);

            messagesToDelete = fetchedMessages.filter((message: Message) => {
                return message.author.id === interaction.client.user?.id && message.createdTimestamp >= timeLimit;
            });
            lastMessageId = fetchedMessages.last()?.id;
            if (fetchedMessages.last()?.createdTimestamp && fetchedMessages.last()?.createdTimestamp! < timeLimit) {
                continueFetching = false;
            }
        } catch (error) {
            throw new Error(formatError(`There was an error trying to fetch messages`, error));
        }

        try {
            await handleReplyOrFollowup(interaction, `Deleting ${messagesToDelete.size} bot messages sent in the last ${time} minutes.`, true);
            for (const message of messagesToDelete.values()) {
                await message.delete();
            }

            await handleReplyOrFollowup(interaction, `Deleted ${messagesToDelete.size} bot messages sent in the last ${time} minutes.`, true);
        } catch (error) {
            throw new Error(formatError(`There was an error trying to delete the messages`, error));
        }
    } while (fetchedMessages.size === 100 && continueFetching);
}

async function executeCondenseChatMessages(interaction: ChatInputCommandInteraction) {
    const time: number = Number(interaction.options.getString("time", false)) == 0 ? 10 : Number(interaction.options.getString("time", false));
    let collectionUrl = interaction.options.getString("collection", false);
    const deleteMessages = !interaction.options.getString("delete", false) || interaction.options.getString("delete", false) == 'Y' ? true : false;

    if (time > 600) {
        throw new Error(`Value provided was greater than max allowed.`);
    }

    const channel = interaction.channel as TextChannel;
    if (!channel) {
        throw new Error(`This command can only be used in text channels`);
    }

    const now = Date.now();
    const timeLimit = now - time * 60 * 1000;

    let fetchedMessages: Collection<string, Message>;
    let messageToAdd: Collection<string, Message> = new Collection();

    let lastMessageId: string | undefined = undefined;
    let continueFetching: boolean = true;
    let collectionData;

    do {
        // get messages from chat
        try {
            fetchedMessages = await fetchMessages(interaction, channel, lastMessageId);

            messageToAdd = fetchedMessages.filter((message: Message) => {
                return !message.content.includes(' ') && validator.isURL(message.content, { require_protocol: true });
            });
            lastMessageId = fetchedMessages.last()?.id;
            if (fetchedMessages.last()?.createdTimestamp && fetchedMessages.last()?.createdTimestamp! < timeLimit) {
                continueFetching = false;
            }
        } catch (error) {
            throw new Error(formatError(`There was an error trying to fetch messages`, error));
        }

        // create collection if needed
        try {
            if (!collectionUrl || collectionUrl.length == 0) {
                collectionData = await createCollection(`NewCollection`); //TODO
                collectionUrl = collectionData.collectionUrl;
            }
        } catch (error) {
            throw new Error(formatError(`There was an error trying to get collection: ${collectionUrl}`, error));
        }
        
        // Add messages to collection
        try {
            await handleReplyOrFollowup(interaction, `Adding ${messageToAdd.size} messages sent in the last ${time} minutes to collection: ${collectionUrl}.`, true);
            for (const message of messageToAdd.values()) {
                await addToCollection(collectionUrl, message.content, null, null);
                if (deleteMessages) {
                    await message.delete();
                }
            }
            collectionData = await getCollection(collectionUrl);
            await handleReplyOrFollowup(interaction, `Added ${messageToAdd.size} messages sent in the last ${time} minutes to collection: ${collectionUrl}.`, true);
            await handleReplyOrFollowupObject(interaction, formatCollection(collectionData));
        } catch (error) {
            throw new Error(formatError(`There was an error trying to add messages to collection: ${collectionUrl}`, error));
        }
    } while (fetchedMessages.size === 100 && continueFetching);
}

export {
    clearBotMessagesCommand,
    condenseChatMessagesCommand,
    executeClearBotMessages,
    executeCondenseChatMessages,
}