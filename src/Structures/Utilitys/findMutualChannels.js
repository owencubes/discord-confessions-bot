const GuildConfig = require('../../Models/GuildConfig')
const ConfessionsClient = require('../Client')

/**
 * 
 * @param {String} userId 
 * @param {ConfessionsClient} client 
 */

module.exports = async (userId, client, message) => {

    const docs = await GuildConfig.find().exec();

    return docs.map(async(doc) => {
        const guild = await client.guilds.fetch(doc.guildId);
        const user = await guild.members.fetch(userId);
        const channel = await client.channels.fetch(doc.channelId)

        if(user?.permissionsIn(channel).toArray().includes('SEND_MESSAGES')) {
            doc = { message: message.content, channel: channel.id }
        }
    })
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
