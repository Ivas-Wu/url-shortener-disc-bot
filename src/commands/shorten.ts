import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { shortenUrl } from "../utils/api";
import { formatError, formatUrl } from "../utils/data.format";
import { handleReplyOrFollowup } from "../utils/discordHelpers";

export const shortenCommand = new SlashCommandBuilder()
    .setName("short")
    .setDescription("Shorten a url")
    .addStringOption(option =>
        option.setName("url")
            .setDescription("Url to shorten")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("name")
            .setDescription("Custom name for url")
            .setRequired(false)
    );

export async function executeShorten(interaction: ChatInputCommandInteraction) {
    const url = interaction.options.getString("url", true);
    const name = interaction.options.getString("name", false);
    try {
        const newUrlDetails = await shortenUrl(url, name);
        await handleReplyOrFollowup(interaction, formatUrl(newUrlDetails))
    }
    catch (error) {
        throw new Error(formatError(`There was an error trying shorten url ${url}: ${error}`, error));
    }
}
