import mongoose from 'mongoose'

export const connetToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/video-tube`
        )
        console.log(
            'MongoDB Connected to Databse Host: ',
            connectionInstance.connection.host
        )
    } catch (error) {
        console.log('Error While Connecting to MongoDB: ', error.message)
        process.exit(1)
    }
}