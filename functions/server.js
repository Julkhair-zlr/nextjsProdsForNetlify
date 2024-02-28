const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const serverless = require('serverless-http');
const router = express.Router();
const port = 3001;
app.use(cors());
app.use(express.json()); // Enable JSON parsing for request body
app.post("/amazon-data", async (req, res) => {
  try {
    // Get the URL from the request body
    const { url } = req.body;
    // Make a request to the provided URL
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Extract image URLs from the div with id 'altImages'
    const altImagesDiv = $("#altImages");
    const imageUrls = altImagesDiv
      .find("img")
      .map((index, element) => $(element).attr("src"))
      .get();
    const extractedData = {
      imageUrls,
    };
    res.json(extractedData);
  } catch (error) {
    console.error("Error fetching data from the provided URL:", error.message);
    res
      .status(error.response ? error.response.status : 500)
      .send(error.message);
  }
});
app.listen(port, () => {
  console.log(`Server is running on this port http://107.23.3.12:${port}`);
});
app.use('/.netlify/functions/server', router);
module.exports.handler = serverless(app)