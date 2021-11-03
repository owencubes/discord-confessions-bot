require('dotenv').config()
new (require('../src/Structures/Client.js'))().start(process.env.TOKEN)
