import mongoose from 'mongoose';

const connectDB = async () => {
  //  console.log("process.env:",process.env );
    console.log("process.env.HTTP_PORT:",process.env.HTTP_PORT);
    console.log("process.env.MONGO_URI:",process.env.MONGO_URI);


    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
};

export default connectDB;