const { Collection } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Get Confession Bots commands!',
  category: 'Util Commands',
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const a = [];
    client.commands.map((cmd) => a.push(cmd.name));
  
    const categories = new Collection();
    client.commands.map((command) => {
      const category = categories.get(command.category);
      if (category) {
        category.set(command.name, command);
      } else {
        categories.set(
          command.category,
          new Collection().set(command.name, command)
        );
      }
    });
    const lines = categories.map(
      (category, name) =>
        `**${name ?? "unknown"}: **  ${category
          .map((command) => `\`${command.name}\``)
          .join(", ")}`
    );
    interaction.editReply({
      embeds: [
        client.embed(
          { title: `My Commands`, description: lines.join('\n') },
          interaction
        ),
      ],
    });
  }
}