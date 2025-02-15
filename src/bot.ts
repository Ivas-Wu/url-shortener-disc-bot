import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import interactionCreate from "./events/interactionCreate";
// import messageCreate from "./events/messageCreate";

import { shortenCommand } from "./commands/shorten";
import { getCollectionCommand, createCollectionCommand, addToCollectionCommand } from "./commands/collection"
import { clearBotMessagesCommand, condenseChatMessagesCommand } from "./commands/messageHandling";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    const commands = [
        shortenCommand, 
        getCollectionCommand, 
        createCollectionCommand, 
        addToCollectionCommand, 
        clearBotMessagesCommand,
        condenseChatMessagesCommand
    ];
    
    try {
        await client.application?.commands.set(commands);
        console.log("Commands registered!");
    } catch (error) {
        console.error("Error registering commands:", error);
    }
});

// messageCreate(client);
interactionCreate(client);

client.login(process.env.TOKEN);
