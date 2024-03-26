// file path: node-backend/mongodbClient.js
import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://westis:UYUT4y5U56fbBpbk@cluster0.odbf45j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
