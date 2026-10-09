const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

const API_KEY = process.env.FINNHUB_API_KEY;

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

async function getQuote(symbol) {

    const url =
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

    const response = await axios.get(url);

    return response.data;
}

app.get("/api/dashboard", async (req, res) => {

    try {

        const spy = await getQuote("SPY");

        let bias = "WAIT";
        let action = "WAIT";

        if (spy.c > spy.pc) {
            bias = "LONG";
            action = "BUY PULLBACKS";
        }

        if (spy.c < spy.pc) {
            bias = "SHORT";
            action = "SELL RALLIES";
        }

        res.json({
            bias,
            action,
            sp500: spy.c,
            previousClose: spy.pc,
            dayHigh: spy.h,
            dayLow: spy.l
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
