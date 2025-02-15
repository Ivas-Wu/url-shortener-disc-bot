import { Client, Message, TextChannel } from "discord.js";

export default (client: Client) => {
    client.on("messageCreate", async (message: Message) => {
        if (message.author.bot) return;

        console.log(`Message received: ${message.content} in ${message.guild?.name}`);
        
        // if (message.content.includes("badwebsite.com")) {
        //     await message.delete();
        //     await (message.channel as TextChannel).send(`${message.author}, that link isn't allowed!`);
        // }
    });
};
