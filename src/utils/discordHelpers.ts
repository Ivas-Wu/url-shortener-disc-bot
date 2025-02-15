import { ChatInputCommandInteraction, Collection, Message, MessageFlags, TextChannel } from "discord.js";

export async function fetchMessages(interaction: ChatInputCommandInteraction, channel: TextChannel, lastMessageId: string | undefined = undefined): Promise<Collection<string, Message>> {
    let fetchedMessages: Collection<string, Message> = new Collection<string, Message>;

    try {
        fetchedMessages = await channel.messages.fetch({
            limit: 100,
            before: lastMessageId
        });
    } catch (error) {
        throw error;
    }
    return fetchedMessages;
}

export async function handleReplyOrFollowup(interaction: ChatInputCommandInteraction, content: string, ephemeral: boolean = false) {
    if (ephemeral) {
        if (isFollowup(interaction)) {
            await interaction.followUp({ content: content, flags: MessageFlags.Ephemeral });
        }
        else {
            await interaction.reply({ content: content, flags: MessageFlags.Ephemeral });
        }
    }
    else {
        if (isFollowup(interaction)) {
            await interaction.followUp({ content: content });
        }
        else {
            await interaction.reply({ content: content });
        }
    }
}

export async function handleReplyOrFollowupObject(interaction: ChatInputCommandInteraction, content: object) {
    if (isFollowup(interaction)) {
        await interaction.followUp(content);
    }
    else {
        await interaction.reply(content);
    }
}

function isFollowup(interaction: ChatInputCommandInteraction) {
    return interaction.replied || interaction.deferred;
}