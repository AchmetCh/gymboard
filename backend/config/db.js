const mongoose = require('mongoose')
require('dotenv').config()
const URL = process.env.MONGDODB_URI


const connect = async() => {
    try {
        await mongoose.connect(URL)
        console.log('Connected to MongoDB')
        } catch (error) {
            throw(error)
            }
            mongoose.connection.on('disconnnected', () => {
                console.log('Disconnected from MongoDB')
            })
            mongoose.connection.on('connected', (error) => {
                console.log('Connected to MongoDB')
                })
}
connect()
module.exports = connect