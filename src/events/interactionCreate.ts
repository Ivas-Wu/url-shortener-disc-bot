import { Client, ChatInputCommandInteraction } from "discord.js";
import { executeShorten } from "../commands/shorten";
import { executeCreateCollection, executeGetCollection, executeAddToCollection } from "../commands/collection";
import { executeClearBotMessages, executeCondenseChatMessages } from "../commands/messageHandling";
import { handleReplyOrFollowup } from "../utils/discordHelpers";

export default (client: Client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction as ChatInputCommandInteraction;

        try {
            // Urls
            if (command.commandName === "short") {
                await executeShorten(interaction);
            }

            // Collections
            if (command.commandName === "cc") {
                await executeCreateCollection(interaction);
            }
            if (command.commandName === "collection") {
                await executeGetCollection(interaction);
            }
            if (command.commandName === "add") {
                await executeAddToCollection(interaction);
            }


            // Util
            if (command.commandName === "clear") {
                await executeClearBotMessages(interaction);
            }
            if (command.commandName === "grab") {
                await executeCondenseChatMessages(interaction);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: error.message, ephemeral: true });
                } else {
                    await handleReplyOrFollowup(interaction, error.message, true);
                }
            } else {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'An unknown error occurred.', ephemeral: true });
                } else {
                    await handleReplyOrFollowup(interaction, 'An unknown error occurred.', true);
                }
            }
        }
    });
};