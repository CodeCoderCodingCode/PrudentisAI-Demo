"use client"
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Sector, Tooltip } from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF0000",
    "#FF00FF",
    "#800080",
    "#0000FF",
    "#00FFFF",
    "#008000",
];

const renderActiveShape = (props) => {
    const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        // weitere Props, falls benötigt
    } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10} // vergrößert das Segment
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                focusable={false}
                tabIndex={-1}// Kein Rahmen an den einzelnen Pie-Stücken

                stroke="#ffff00" // z. B. schwarzer Rahmen
                strokeWidth={2}
                onFocus={(e) => e.target.blur()}
            />
        </g>
    );
};

const DashboardOverview = ({ accounts, transactions }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );

    // Filtere Transaktionen für das ausgewählte Konto
    const accountTransactions = transactions.filter(
        (t) => t.accountId === selectedAccountId
    );

    const [activeIndex, setActiveIndex] = useState(-1);

    const recentTransactions = accountTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Berechne die Ausgaben für den aktuellen Monat
    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
            t.type === "EXPENSE" &&
            transactionDate.getFullYear() === currentDate.getFullYear() &&
            transactionDate.getMonth() === currentDate.getMonth()
        );
    });

    // Gruppiere Ausgaben nach Kategorie
    const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
    }, {});

    // Formatiere die Daten für das PieChart
    const pieChartData = Object.entries(expensesByCategory).map(
        ([category, amount]) => ({
            name: category,
            value: amount,
        })
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger className="w-[140px] border-none focus:ring-0 focus:outline-none">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-yellow-200 hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id} className="bg-black text-yellow-300">
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div>
                        {recentTransactions.length === 0 ? (
                            <p className="text-center text-amber-200 hover:text-red-300 py-4">
                                No recent Transactions
                            </p>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between">
                                    <div className="space-y-1 py-2">
                                        <p className="text-sm font-medium leading-none">
                                            {transaction.description || "Untitled Transaction"}
                                        </p>
                                        <p className="text-sm text-yellow-200">
                                            {format(new Date(transaction.date), "yyyy-MM-dd")}
                                        </p>
                                    </div>
                                    <div>
                                        <div
                                            className={cn(
                                                "flex items-center",
                                                transaction.type === "INCOME" ? "text-green-400" : "text-red-400"
                                            )}
                                        >
                                            {transaction.type === "EXPENSE" ? (
                                                <ArrowDownRight className="mr-1 h-4 w-4" />
                                            ) : (
                                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                            )}
                                            ${transaction.amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
                <CardHeader>
                    <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                    {pieChartData.length === 0 ? (
                        <p className="text-center text-amber-200 hover:text-red-300 py-4">
                            No expenses this month
                        </p>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        onMouseEnter={(data, index) => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(-1)}


                                        fill="#8884d8"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#bbff00"
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#05121c", color: "#fff1c2", borderRadius: "8px" }}
                                        itemStyle={{ color: "#fff1c2" }}
                                        formatter={(value) => `$${Number(value).toFixed(2)}`}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
