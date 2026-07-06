import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "inacap_project";

export async function connectDB() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("Connected to MongoDB via Mongoose:", DB_NAME);
}
