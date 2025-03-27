export async function GET() {
    const apiKey = process.env.OPEN_EXCANGE_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key fehlt" }), { status: 500 });
    }

    try {
        const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'INR', 'BRL', 'RUB', 'HKD', 'SGD', 'KRW', 'BTC', 'ETH', 'XAU'];
        const currencyQuery = currencies.join(',');

        const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${currencyQuery}`);

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Fehler bei API-Anfrage" }), { status: response.status });
        }

        const data = await response.json();
        const rates = Object.entries(data.rates).slice(0, 20).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        // EUR als Basis setzen
        const eurRate = rates['EUR']; // 1 EUR = eurRate (gegenüber USD)
        const ratesInEUR = Object.entries(rates).reduce((acc, [key, value]) => {
            acc[key] = value / eurRate; // Umrechnung auf EUR
            return acc;
        }, {});

        // Gebe beide Versionen zurück: Originalwerte und Umrechnung auf EUR
        return new Response(
            JSON.stringify({
                rates,         // Original Wechselkurse
                ratesInEUR,    // Wechselkurse in EUR als Basis
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
