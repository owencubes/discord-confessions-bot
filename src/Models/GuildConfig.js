const mongoose = require('mongoose')

module.exports = mongoose.model('GuildConfig', new mongoose.Schema({
    guildId: {
        type: String, 
        required: true
    },
    channelId: {
        type: String,
        required: false,
    }
}))