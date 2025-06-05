const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    // Try fetching JSON from common API endpoints
    const apiResponse = await axios.get(url + "/api");
    if (apiResponse.headers["content-type"].includes("application/json")) {
      return res.json({ source: "API", data: apiResponse.data });
    }
  } catch (err) {
    console.log("No API found, falling back to scraping...");
  }

  // If API not found, scrape the HTML
  try {
    const htmlResponse = await axios.get(url);
    const $ = cheerio.load(htmlResponse.data);
    let scrapedData = [];
    $("h1, h2, h3, p").each((i, el) => {
      scrapedData.push($(el).text());
    });

    return res.json({ source: "Scraped", data: scrapedData });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5050, () => console.log("Server running on port 5050"));
