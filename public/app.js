async function updateDashboard() {

    try {

        const response =
            await fetch('/api/dashboard');

        const data =
            await response.json();

        document.getElementById('sp500').innerHTML =
            data.sp500;

        document.getElementById('action').innerHTML =
            data.change > 0
                ? '🟢 BUY BIAS'
                : '🔴 SELL BIAS';

    } catch(error) {

        console.error(error);

        document.getElementById('action').innerHTML =
            '⚠ DATA ERROR';
    }
}

updateDashboard();

setInterval(updateDashboard, 60000);
