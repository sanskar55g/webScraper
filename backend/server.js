const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        
        const data = await page.evaluate(() => {
            let rows = document.querySelectorAll("table tr");
            return Array.from(rows, row => 
                Array.from(row.querySelectorAll("th, td"), cell => cell.innerText.trim())
            );
        });

        if (data.length === 0) {
            
            const altData = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("p, li"), el => el.innerText.trim());
            });
            return res.json({ source: "Puppeteer", data: altData });
        }

        res.json({ source: "Puppeteer", data });

    } catch (error) {
        console.error("Scraping failed:", error);
        res.status(500).json({ error: "Scraping failed" });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
