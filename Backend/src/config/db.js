const mongoose=require("mongoose")

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch(err){
        console.error("Database connection err:",err)
    }
}

module.exports=connectDB