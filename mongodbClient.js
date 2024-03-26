// file path: node-backend/mongodbClient.js
import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
  }
}

export { connectToMongoDB };
