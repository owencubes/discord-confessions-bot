const { CommandInteraction } = require('discord.js')
const ConfessionClient = require('../../Structures/Client')
const GuildConfig = require('../../Models/GuildConfig')

module.exports = {
  name: 'set',
  description: 'Set the channel for the bot',
  category: 'Util Commands',
  options: [
      {
        name: 'channel',
        description: 'set the vent channel',
        type: 'CHANNEL',
        required: true
      }
  ],
  /**
   * 
   * @param {ConfessionClient} client 
   * @param {CommandInteraction} interaction 
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const config = await GuildConfig.findOne({ guildId: interaction.guildId })
    if(config){
        GuildConfig.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId, channel: interaction.options.get('channel').value })
        interaction.editReply({ content: `set the vent channel to <#${interaction.options.get('channel')?.value}>` })
    } else {
        new GuildConfig({
            guildId: interaction.guildId,
            channelId: interaction.options.get('channel')?.value
        })
        interaction.editReply({ content: `set the vent channel to <#${interaction.options.get('channel')?.value}>` })
    }
  }
}