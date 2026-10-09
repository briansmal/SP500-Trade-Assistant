async function loadDashboard() {

    try {

        const response =
            await fetch('/api/dashboard');

        const data =
            await response.json();

        document.getElementById('bias').innerText =
            data.bias;

        document.getElementById('sp500').innerText =
            data.sp500;

        document.getElementById('action').innerText =
            data.action;

        document.getElementById('regime').innerText =
            data.bias === 'LONG'
                ? 'TREND BULL'
                : 'TREND BEAR';

        document.getElementById('divergence').innerText =
            'NONE';

        document.getElementById('vix').innerText =
            'Coming Soon';

    }
    catch (error) {

        console.error(error);

        document.getElementById('bias').innerText =
            'ERROR';

    }

}

loadDashboard();

setInterval(loadDashboard, 60000);
