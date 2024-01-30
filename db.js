const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongoURL)
        console.log({msg:`MongoDB connected`})
    } catch (error) {
        console.log({msg: "MongoDB not connected", error})
        
    }
}

module.exports = connectDB