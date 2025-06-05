import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default function WebScraper() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [csvLink, setCsvLink] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5050/api/scrape", { url });
  
      if (response.data.source === "API") {
        console.log("Using API data:", response.data.data);
      } else {
        console.log("Using scraped data:", response.data.data);
      }
  
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };
  

  const handleExport = async () => {
    try {
      const response = await axios.post("http://localhost:5050/export", { url });
      setCsvLink(response.data.file);
    } catch (error) {
      console.error("CSV Export failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 min-h-screen bg-black text-white">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="text-3xl font-bold neon-text">
        Fancy Web Scraper
      </motion.h1>

      <div className="flex space-x-4 my-5">
        <Input type="text" placeholder="Enter website URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-96 p-2 border rounded-lg" />
        <Button onClick={handleScrape} className="bg-purple-500 hover:bg-purple-700 p-2">Scrape</Button>
      </div>

      {loading && <Progress value={progress} className="w-full mt-3" />}

      {data.length > 0 && (
        <Card className="mt-5 w-full max-w-2xl p-5 bg-gray-800 rounded-lg shadow-md">
          <CardContent>
            <h2 className="text-xl font-bold">Scraped Data</h2>
            <ul className="mt-2 text-sm">
              {data.map((item, index) => (
                <li key={index} className="border-b py-1">{item}</li>
              ))}
            </ul>
            <Button onClick={handleExport} className="mt-3 bg-green-500 hover:bg-green-700">Export CSV</Button>
            {csvLink && <a href={csvLink} download className="block mt-2 text-blue-400">Download CSV</a>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
