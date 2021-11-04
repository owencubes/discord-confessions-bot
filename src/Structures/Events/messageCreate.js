const { Message, MessageActionRow, MessageSelectMenu } = require('discord.js')
const ConfessionsClient = require('../Client')
const findMutuals = require('../Utilitys/findMutualChannels')


/**
 * 
 * @param {Message} message 
 * @param {ConfessionsClient} client 
 */
//  export interface MessageSelectOptionData {
//     default?: boolean;
//     description?: string;
//     emoji?: EmojiIdentifierResolvable;
//     label: string;
//     value: string;
//   }
module.exports = async (message, client) => {
    if(message.channel.type != 'DM') return;

    const channels = await findMutuals(message.author.id, client, message)
    if(!channels || !channels[0]) return message.react('❌')
    if(channels[1]) {
        const menu = new MessageSelectMenu().setCustomId('multiple-servers');
        channels.map((c) => {
            menu.addOptions([{ label: c.guildName, description: `the venting channel in: ${c.guildName}`, value: `${c.channel},..${c.message}` }])
        })
        message.reply({ components: [new MessageActionRow().addComponents([menu])],  embeds: [client.embed({ title: 'There are multiple servers to send this message to', description: `Please select a server in the dropdown below` })] })
        const collector = await message.channel.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            if(!i.isSelectMenu()) return;
            let a = i.values[0].split(',..')
            const chid = a.shift();

            const c = await client.channels.fetch(chid)
            const msg = a.join(',..')
            c.send({ embeds: [client.embed({ description: msg })] })

            i.reply('👍')
        })
    } else {
        message.react('✅')
        const channel = await client.channels.fetch(channels[0].channel)
        
        channel.send({ embeds: [client.embed({ description: channels[0].message })] })
    }
}