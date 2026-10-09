async function updateDashboard() {

    try {

        const response =
            await fetch('/api/dashboard');

        const data =
            await response.json();

        document.getElementById('bias')
            .innerHTML =
            data.bias;

        document.getElementById('action')
            .innerHTML =
            data.action;

        document.getElementById('sp500')
            .innerHTML =
            data.sp500;

    } catch(error) {

        console.error(error);

        document.getElementById('bias')
            .innerHTML =
            'DATA ERROR';

    }

}

updateDashboard();

setInterval(
    updateDashboard,
    60000
);
