const GuildConfig = require('../../Models/GuildConfig')
const ConfessionsClient = require('../Client')

/**
 * 
 * @param {String} userId 
 * @param {ConfessionsClient} client 
 */

module.exports = async (userId, client, message) => {

    const docs = await GuildConfig.find().exec();
    const channels = []

    await Promise.all(docs.map(async(doc) => {
        const guild = await client.guilds.fetch(doc.guildId);
        const user = await guild.members.fetch(userId);
        const channel = await client.channels.fetch(doc.channelId)

        if(user?.permissionsIn(channel).toArray().includes('SEND_MESSAGES')) {
            channels.push({ message: message.content, channel: channel.id, guildName: guild.name })
        }
    }))

    return channels
}
    // GuildConfig.find(async (e, docs) => {
    //     if(e) return console.log(e);

    //     docs.map(async(doc) => {
    //         const guild = await client.guilds.fetch(doc.guildId);
    //         const user = await guild.members.fetch(userId);
    //         const channel = await client.channels.fetch(doc.channelId)
    //         if(user?.permissionsIn(channel).toArray().includes('SEND_MESSAGES')) {
    //             await channels.push({ message: message.content, channel: channel.id })
    //         }
    //     })
    // })
