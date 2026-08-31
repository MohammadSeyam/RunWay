import mongoose from "mongoose"

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongodb connected sucessfully')
    }
    catch(err){
        console.log(err)
    }
}

export default connectDB