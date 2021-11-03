const { Message } = require('discord.js')
const ConfessionsClient = require('../Client')
const findMutuals = require('../Utilitys/findMutualChannels')


/**
 * 
 * @param {Message} message 
 * @param {ConfessionsClient} client 
 */

module.exports = async (message, client) => {
    if(message.channel.type != 'DM') return;

    const channels = await findMutuals(message.author.id, client, message)
    if(!channels || !channels[0]) return message.react('❌')
    if(channels[1]) {
        message.reply({ embeds: [client.embed({ title: 'There are multipule channels to send this message to', description: `Please select a channel in the dropdown below` })] })
    } else {
        message.react('✅')
        console.log(channels)
        const channel = await client.channels.fetch(channels[0].channel)
        
        channel.send({ embeds: [client.embed({ description: channels[0].message })] })
    }
}