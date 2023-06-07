import { useEffect, useState } from "react"
import { Paper, Button, Typography, CircularProgress } from "@mui/material"
import {
  FileCopyOutlined as CopyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import "../index.css"

function App() {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [copiedQuote, setCopiedQuote] = useState(null)
  // const url = "https://zenquotes.io/api/random"
  // const proxy = "https://cors-anywhere.herokuapp.com/"

  const fetchQuote = () => {
    setIsLoading(true)
    setCountdown(2)

    setTimeout(() => {
      fetch("https://api.api-ninjas.com/v1/quotes", {
        headers: { "X-Api-Key": "kWSZl05zxFblZiGhJA5BeA==5krAHMWX7q6zlC1u" },
      })
        .then((res) => res.json())
        .then((data) => {
          setQuotes(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching quote:", error)
          setIsLoading(false)
        })
    }, 2000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedQuote(text)

    setTimeout(() => {
      setCopiedQuote(null)
    }, 2000)
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  useEffect(() => {
    if (countdown > 0 && isLoading) {
      const timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countdown, isLoading])

  return (
    <div className="centered">
      <Paper elevation={3} className="quotes-card">
        {!isLoading && (
          <div className="header">
            <Button
              variant="contained"
              color="primary"
              className="generate-btn"
              onClick={fetchQuote}
              startIcon={<RefreshIcon />}
            >
              Generate
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="copy-btn"
              disabled={quotes.length === 0}
              onClick={() =>
                copyToClipboard(quotes[0]?.quote + " -" + quotes[0]?.author)
              }
              startIcon={<CopyIcon />}
            >
              {copiedQuote === quotes[0]?.quote + " -" + quotes[0]?.author
                ? "Copied!"
                : "Copy"}
            </Button>
          </div>
        )}
        {isLoading ? (
          <div className="loading">
            <CircularProgress size={40} color="primary" />
          </div>
        ) : (
          quotes.map((quote, idx) => (
            <div
              className={`quote-card ${!isLoading ? "loaded" : ""}`}
              key={idx}
            >
              <Typography variant="h5" className="quote-text">
                {quote.quote}
              </Typography>
              <Typography variant="body1" className="author-text">
                - {quote.author}
              </Typography>
            </div>
          ))
        )}
      </Paper>
    </div>
  )
}

export default App
