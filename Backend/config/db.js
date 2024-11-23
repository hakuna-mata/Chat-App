const mongoose = require("mongoose")

async function main(){
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Mongodb connected to ${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(0)
    }
}

module.exports=main