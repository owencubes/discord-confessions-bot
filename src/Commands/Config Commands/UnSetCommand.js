const { CommandInteraction } = require('discord.js')
const ConfessionClient = require('../../Structures/Client')
const GuildConfig = require('../../Models/GuildConfig')

module.exports = {
  name: 'unset',
  description: 'remove the set channel',
  category: 'Config Commands',
  /**
   * 
   * @param {ConfessionClient} client 
   * @param {CommandInteraction} interaction 
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    if(!interaction.options.get('channel').channel.isText()) return interaction.editReply({ content: `must be a text channel.` })

    const config = await GuildConfig.findOne({ guildId: interaction.guildId })
    if(config) {
        GuildConfig.findOneAndDelete({ guildId: interaction.guildId });
    }
    interaction.editReply({ content: 'removed the set channel.' })
  }
}