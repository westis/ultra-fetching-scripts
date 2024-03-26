// file path: node-backend/server.js

const express = require("express");
const app = express();
const port = 3000;

app.get("/event-data", async (req, res) => {
  const originalData = await fetchData();
  const transformedData = transformData(originalData);
  res.json(transformedData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
