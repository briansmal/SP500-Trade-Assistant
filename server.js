const axios = require("axios");

const API_KEY = process.env.FINNHUB_API_KEY;

async function getQuote(symbol) {
    const url =
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

    const response = await axios.get(url);

    return response.data;
}

app.get('/api/dashboard', async (req, res) => {

    try {

        const sp500 = await getQuote('SPY');

        res.json({
            sp500: sp500.c,
            previousClose: sp500.pc,
            dayHigh: sp500.h,
            dayLow: sp500.l,
            dayOpen: sp500.o,
            change:
                (((sp500.c - sp500.pc) /
                sp500.pc) * 100).toFixed(2)
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});
