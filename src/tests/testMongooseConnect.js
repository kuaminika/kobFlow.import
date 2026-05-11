
import 'dotenv/config';
import connectDB from "../util/DBConnector_Mongo.js";

connectDB().catch(console.error);