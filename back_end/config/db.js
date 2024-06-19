const mongoose = require('mongoose');


const conectDB = async ()=>{
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URL,
            {
                useNewUrlParser:true,
                
                
            }
        );

        console.log('mongoDB conected : ' + connection.connection.host)
    } catch (error) {
        console.log('error , mongoDB is not connected ' + error.message);
        process.exit();
    }
}

module.exports = conectDB;