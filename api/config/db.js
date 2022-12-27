import mongoose from 'mongoose';


//Create a mongoose connection
const mongoDBConnect = async () => {


    try {

        const mongoDBConnect = await mongoose.connect(process.env.MONGO_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        });
        console.log(`MongoDB connected successfully `.bgBlue.black);
    } catch (error) {

        console.log(error);
    }
}


//export mongo connection
export default mongoDBConnect;