# Ultralive 6 Days Race - Backend Function

This project contains a Google Cloud Function responsible for fetching and updating data for the Ultralive 6 Days Race from MongoDB Atlas.

## Project Structure

- `index.js`: Contains the primary Cloud Function handler (`runMongoDBTask`).
- `fetch6DaysBelgium.js`: Core data fetching, transformation, and MongoDB update logic.
- `mongodbClient.js`: Handles connecting to MongoDB Atlas and caching the connection.
- `package.json`: Project dependencies.

## Google Cloud Function

- **Name:** fetch6DaysBelgium
- **Runtime:** Node.js 20
- **Trigger:** HTTP Trigger (can also be configured for scheduling)
- **URL:** [The URL of your deployed function]
- **Secret Manager:** Stores the MongoDB Atlas connection string.

## MongoDB Atlas

- **Connection String:** (Replace placeholders with your actual values)
  `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority`
- **Cluster Name:** [Your MongoDB Atlas Cluster Name]
- **Database:** [Your MongoDB Atlas Database Name]
- **Collection:** [Your MongoDB Atlas Collection Name]

## Deployment

1. **Install Dependencies:** `npm install`
2. **Deploy to Google Cloud:** `gcloud functions deploy fetch6DaysBelgium --runtime nodejs20 --trigger-http --entry-point runMongoDBTask --region europe-west1`

## Scheduling

- The Cloud Function can be scheduled using Cloud Scheduler (refer to Google Cloud documentation for setup).

## Additional Notes

- [Add any other relevant project notes or instructions here.]
