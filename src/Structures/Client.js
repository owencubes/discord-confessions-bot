const { Client, Collection, MessageEmbed } = require("discord.js");
const glob = require("glob");
const { promisify } = require("util");
const mongoose = require("mongoose");
const ms = require("ms");

const globPromise = promisify(glob);

module.exports = class TrashCan extends Client {
    constructor() {
        super({ intents: ["GUILD_MEMBERS", "GUILDS"] });

        this.embed = (options) => {
            new MessageEmbed({ ...options })
                .setColor("GREY");
        };
        this.commands = new Collection();
        this.Cooldowns = new Collection();
        mongoose.connect(process.env.MONGO_URI)
    }

    async start(token) {
        this.login(token);

        this.on("ready", async () => {
            console.log(`${this.user?.username} is now online`);

            const commandFiles = await globPromise(
                `${__dirname}/../Commands/**/*{.ts,.js}`
            );
            commandFiles.map(async (file) => {
                const File = require(file);
                this.application.commands.create(File);

                this.guilds.cache.get("887691300432937080")?.commands.create(File);

                this.commands.set(File.name, File);
            });
        });

        this.on("interactionCreate", (interaction) => {
            if (interaction.isCommand()) {
                const command = this.commands.get(interaction.commandName);
                if (command) {
                    if (command.cooldown) {
                        if (this.Cooldowns.has(`${command.name}${interaction.user.id}`))
                            return interaction.reply({
                                embeds: [
                                    this.embed(
                                        {
                                            description: `There is a cooldown on this command! Please try again in \`${ms(
                                                this.Cooldowns.get(
                                                    `${command.name}${interaction.user.id}`
                                                ) - Date.now(),
                                                { long: true }
                                            )}\``,
                                        },
                                        interaction
                                    ),
                                ],
                            });

                        this.Cooldowns.set(
                            `${command.name}${interaction.user.id}`,
                            Date.now() + command.cooldown
                        );
                        setTimeout(() => {
                            this.Cooldowns.delete(`${command.name}${interaction.user.id}`);
                        }, command.cooldown);
                    }

                    if (
                        !interaction.member.permissions.has(command.userPermissions || [])
                    )
                        return interaction.reply({
                            embeds: [
                                this.embed(
                                    {
                                        description:
                                            "you do not have permissions to run this command!",
                                    },
                                    interaction
                                ),
                            ],
                            ephemeral: true,
                        });

                    command?.run(this, interaction);
                }
            }
            if (interaction.isContextMenu())
                this.commands.get(interaction.commandName)?.run(this, interaction);
        });
    }
};