import React, { useState, useEffect } from "react";
import axios from 'axios';
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WebScraper() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [csvLink, setCsvLink] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, [darkMode]);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5050/api/scrape", { url });
  
      if (response.data.source === "Puppeteer") {
        console.log("Using Puppeteer:", response.data.data);
      }
  
      setData(response.data.data);
      generateCSV(response.data.data); 
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };
  
  
  const generateCSV = (data) => {
    if (!data || data.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8," + data.map(item => `"${item}"`).join("\n");
    let encodedUri = encodeURI(csvContent);
    setCsvLink(encodedUri);
  };

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"} 
         style={{ backgroundImage: "url('https://www.scraperapi.com/wp-content/uploads/10-tips-for-web-scraping.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary position-relative">
        <div className="container position-relative">
          <a className="navbar-brand" href="#">ScrapeX</a>
          <div className="position-relative">
            <div className="d-inline-block position-relative">
              <motion.div
                className="position-absolute bg-light rounded"
                layoutId="activeTab"
                initial={false}
                animate={{ left: activePage === "home" ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ width: "50%", height: "100%", zIndex: -1 }}
              />
              <button className="btn btn-light me-2 position-relative" onClick={() => setActivePage("home")}>Home</button>
              <button className="btn btn-light position-relative" onClick={() => setActivePage("history")}>History</button>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      {activePage === "home" && (
        <div className="container py-5">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="text-center text-primary fw-bold">
            ScrapeX
          </motion.h1>

          <div className="input-group my-4 w-50 mx-auto">
            <input type="text" className="form-control" placeholder="Enter website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button onClick={handleScrape} className="btn btn-primary">
              Scrape
            </button>
          </div>

          {loading && <div className="progress w-50 mx-auto">
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}></div>
          </div>}

          {data.length > 0 && (
            <div className="card p-4 mt-4 w-75 mx-auto" style={{ backgroundColor: darkMode ? "#333" : "#f8f9fa", opacity: 0.9 }}>
              <h2 className={darkMode ? "text-white" : "text-dark"}>Scraped Data</h2>
              <ul className="list-group list-group-flush">
                {data.map((item, index) => (
                  <li key={index} className={darkMode ? "list-group-item bg-dark text-white" : "list-group-item"}>{item}</li>
                ))}
              </ul>
              {csvLink && (
                <a href={csvLink} download="scraped_data.csv" className="btn btn-success mt-3">
                  Download CSV
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {activePage === "history" && (
        <div className="container py-5">
          <h2 className="text-center">Scraping History</h2>
          <ul className="list-group w-50 mx-auto">
            {history.length === 0 ? <li className="list-group-item">No history yet.</li> : 
              history.map((url, index) => (
                <li key={index} className="list-group-item">{url}</li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}
