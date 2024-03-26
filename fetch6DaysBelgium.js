// File path: /node-backend/fetch6DaysBelgium.js
// Usage: node fetch6DaysBelgium.js
import axios from "axios";
import {
  timeStringToSeconds,
  extractKmFromString,
  secondsToHMS,
  kmToMiles,
  calculatePace,
} from "./helperFunctions.js";
import fs from "fs";
import { connectToMongoDB } from "./mongodbClient.js";

// Mocked event details and annotations for demonstration
const eventDetails = {
  eventId: "1",
  eventName: "6 Days Race - Belgium",
  eventStartDateTime: "2024-03-24T16:00:00Z",
  eventDuration: "144:00:00",
  displayStartDate: "2024-03-24",
  displayEndDate: "2024-08-28",
  annotations: [
    { name: "World Record", value: "1036.8" },
    // Add more annotations as needed
  ],
};

// Fetch data from endpoint
async function fetchData() {
  const url = `https://svc.star-tracking.be/App/Results/Result?eventID=790&categoryID=9331&detailID=331753&language=en`;
  try {
    const response = await axios.get(url);
    return response.data; // This is the original data fetched from the endpoint
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Transform the data into the structure we want
function transformData(originalData) {
  let cumulativeTimeInSeconds = 0;
  let additionalSecondsForDays = 0;
  let previousResultSeconds = 0;
  const eventDurationInSeconds = timeStringToSeconds(
    eventDetails.eventDuration
  );

  const segments = originalData.CheckPoints.map((checkPoint, index) => {
    const currentResultSeconds = timeStringToSeconds(checkPoint.Result);
    if (index > 0 && currentResultSeconds < previousResultSeconds) {
      additionalSecondsForDays += 24 * 3600;
    }
    cumulativeTimeInSeconds = currentResultSeconds + additionalSecondsForDays;

    const cumulativeDistanceInKm =
      Math.floor(extractKmFromString(checkPoint.Distance) * 1000) / 1000; // Rounded down to the nearest meter, then converted back to km
    const cumulativeDistanceInMiles = kmToMiles(cumulativeDistanceInKm);

    // For split calculations, ensure you handle the first segment correctly
    const splitTimeInSeconds =
      index === 0
        ? cumulativeTimeInSeconds
        : cumulativeTimeInSeconds -
          (timeStringToSeconds(originalData.CheckPoints[index - 1].Result) +
            additionalSecondsForDays);
    const prevDistanceInKm =
      index > 0
        ? Math.floor(
            extractKmFromString(originalData.CheckPoints[index - 1].Distance) *
              1000
          ) / 1000
        : 0;
    const splitDistanceInKm = cumulativeDistanceInKm - prevDistanceInKm;
    const splitDistanceInMiles = kmToMiles(splitDistanceInKm);

    const avgPaceInSecondsPerKm =
      cumulativeDistanceInKm > 0
        ? cumulativeTimeInSeconds / cumulativeDistanceInKm
        : 0;
    const splitPaceInSecondsPerKm =
      splitDistanceInKm > 0 ? splitTimeInSeconds / splitDistanceInKm : 0;
    const splitPaceInSecondsPerMile =
      splitDistanceInMiles > 0 ? splitTimeInSeconds / splitDistanceInMiles : 0;

    const projectedDistanceInKm =
      eventDurationInSeconds / avgPaceInSecondsPerKm;
    const projectedDistanceInMiles = kmToMiles(projectedDistanceInKm);

    previousResultSeconds = currentResultSeconds;

    return {
      cumulativeTime: secondsToHMS(cumulativeTimeInSeconds),
      cumulativeTimeInSeconds,
      cumulativeDistanceInKm,
      distanceInMiles: cumulativeDistanceInMiles,
      avgPaceInSecondsPerKm,
      avgPaceInSecondsPerMile: avgPaceInSecondsPerKm * 1.60934,
      splitDistanceInKm,
      splitDistanceInMiles,
      splitTimeInSeconds: Math.ceil(splitTimeInSeconds),
      splitPaceInSecondsPerKm,
      splitPaceInSecondsPerMile,
      projectedDistanceInKm,
      projectedDistanceInMiles,
    };
  });

  return {
    runnerId: String(originalData.ID),
    runnerName: originalData.Name.trim(),
    segments,
  };
}

async function run() {
  const originalData = await fetchData();
  if (!originalData) {
    console.log("No data fetched.");
    return;
  }

  const transformedParticipantData = transformData(originalData);

  const finalJson = {
    ...eventDetails,
    participants: [transformedParticipantData],
  };

  // Updating the MongoDB database with the generated JSON data
  await updateMongoDBWithData(finalJson);
}

async function updateMongoDBWithData(finalJson) {
  const client = await connectToMongoDB();
  if (!client) {
    console.log("MongoDB connection failed.");
    return;
  }

  try {
    const database = client.db("Ultralive");
    const collection = database.collection("6DaysRaceBelgium");

    // Example: Update a document matching the eventId, or insert if not exists
    const updateResult = await collection.updateOne(
      { eventId: finalJson.eventId },
      { $set: finalJson },
      { upsert: true }
    );

    console.log(
      `${updateResult.matchedCount} document(s) matched, ${updateResult.upsertedCount} document(s) inserted or updated.`
    );
  } catch (error) {
    console.error("Failed to update MongoDB:", error);
  } finally {
    await client.close();
  }
}

// Execute run initially when script is started
run().catch(console.error);
