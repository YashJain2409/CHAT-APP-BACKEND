const mongoose = require('mongoose');

const connectDB = async() => {
    try{
       const conn = await mongoose.connect(process.env.MONGO_URI);
       console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline);
    }catch(err){
       console.log(`Error: ${err.message}`.red.bold);
       process.exit();
    }
}

module.exports = connectDB;