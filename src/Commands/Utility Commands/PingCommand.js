const ms = require('ms')

module.exports = {
  name: 'ping',
  description: 'get the websocket ping & bot uptime',
  category: 'Util Commands',
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    interaction.editReply({
      embeds: [
        client.embed(
          {
            title: `Pong!`,
            description: `Websocket ping: \`${client.ws.ping}ms\`\nUptime: ${ms(
              client.uptime
            )}`,
          },
          interaction
        ),
      ],
    });
  }
}