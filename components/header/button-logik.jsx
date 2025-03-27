"use client"; // Macht diese Komponente zur Client-Komponente

import { useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function ExchangeRateButton() {
    const fetchExchangeRates = async () => {
        try {
            const res = await fetch("/api/exchangeRates"); // API-Route aufrufen
            if (res.ok) {
                const data = await res.json();
                console.log("Wechselkurse (Original):", data.rates); // Originalwerte ausgeben
                console.log("Wechselkurse in EUR als Basis:", data.ratesInEUR); // In EUR umgerechnete Werte ausgeben

                // Zeige beides in der UI an
                setOriginalRates(data.rates);
                setRatesInEUR(data.ratesInEUR);
            } else {
                console.error("Fehler beim Abrufen der Wechselkurse");
            }
        } catch (error) {
            console.error("Fetch Error: ", error);
        }
    };

    const [originalRates, setOriginalRates] = useState({});
    const [ratesInEUR, setRatesInEUR] = useState({});

    return (
        <div>
            <Button
                variant="ghost"
                className="text-yellow-200 rounded-full w-10 h-10"
                onClick={fetchExchangeRates}
            >
                <CircleDollarSign />
            </Button>
            <Select>
                <SelectTrigger className="w-[80px] text-yellow-200">
                    <SelectValue placeholder={<CircleDollarSign />}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                    <SelectItem value="SEK">SEK</SelectItem>
                    <SelectItem value="NZD">NZD</SelectItem>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="RUB">RUB</SelectItem>
                    <SelectItem value="HKD">HKD</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="KRW">KRW</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="XAU">XAU</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
