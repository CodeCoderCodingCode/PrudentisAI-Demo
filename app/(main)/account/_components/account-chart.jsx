"use client"

import React, {useMemo} from 'react'
import {Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {endOfDay, format, startOfDay, subDays} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


const DATE_RANGES = {
    "7D": {label: "Last 7 Days", days: 7},
    "1M": {label: "Last Month", days: 30},
    "3M": {label: "Last 3 Months", days: 90},
    "6M": {label: "Last 6 Months", days: 180},
    "1Y": {label: "Last Year", days: 365},
    ALL: {label: "All Time", days: null},
}

const AccountChart = ({transactions}) => {
    const [dateRange, setDateRange] = React.useState("1M");

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDate =  range.days
            ? startOfDay(subDays(now, range.days))
            : startOfDay(new Date(0));
    const filtered = transactions.filter(
        (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc,transaction) => {

        const date = format(new Date(transaction.date), "yyyy MMM dd");



        if(!acc[date])
            {
                acc[date] = { date, income: 0, expense: 0 };
            }

        if (transaction.type === "INCOME") {
            acc[date].income += transaction.amount;
        } else {
            acc[date].expense += transaction.amount;
            }
        return acc;
        }, {});

        return Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );


    }, [transactions, dateRange]);

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, day) => ({
            income: acc.income += day.income,
            expense: acc.expense += day.expense,
            }), { income: 0, expense: 0 }
        );
    }, [filteredData]);

    return (
        <Card className="bg-black/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(DATE_RANGES).map(([key, {label}]) => {
                              return <SelectItem key={key} value={key}>
                                  {label}
                              </SelectItem>;
                            })}
                    </SelectContent>
                </Select>

            </CardHeader>
            <CardContent>
                <div className="flex justify-around mb-6 text-sm">
                    {/* ... deine Totals ... */}
                </div>

                <div className="h-[300px]">
                    {filteredData.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-center text-amber-500 hover:text-yellow-300">No Transactions Found</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={filteredData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(tick) =>
                                        // Entfernt die ersten 5 Zeichen ("yyyy "): wenn tick z.B. "2025 Jan 15" ist, wird daraus "Jan 15"
                                        tick.length > 6 ? tick.substring(5) : tick
                                    }
                                />

                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <Tooltip contentStyle={{ backgroundColor: "#05121c"}} formatter={(value) => [`$${value.toFixed(2)}`, undefined]} />
                                <Legend />
                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill="#82ca9d"
                                    radius={[4, 4, 0, 0]}
                                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                                />
                                <Bar
                                    dataKey="expense"
                                    name="Expense"
                                    fill="#8884d8"
                                    radius={[4, 4, 0, 0]}
                                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>

        </Card>


    )
}
export default AccountChart
