import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("db url ", `${process.env.MONGODB_URL}/${DB_NAME}`);
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL,
      {
        dbName: DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(`Database Name: ${connectionInstance.connection.name}`);
    console.log(`Connection State: ${mongoose.STATES[connectionInstance.connection.readyState]}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
