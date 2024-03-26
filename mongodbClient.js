// file path: node-backend/mongodbClient.js
import { MongoClient } from "mongodb";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const secretClient = new SecretManagerServiceClient();

async function getMongoDBUri() {
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/ultralive-395814/secrets/MONGODB_URI/versions/latest`,
  });
  return version.payload.data.toString("utf8");
}

let cachedClient = null;

async function connectToMongoDB() {
  if (
    cachedClient &&
    cachedClient.topology &&
    cachedClient.topology.isConnected()
  ) {
    // Check if the topology is connected
    return cachedClient;
  }

  const uri = await getMongoDBUri();
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

export { connectToMongoDB };
