"use client"

import React, {useEffect, useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, Pencil, X} from "lucide-react";
import {updateBudget} from "@/actions/budget";
import useFetch from "@/hooks/use-fetch";
import {toast} from "sonner";
import {Progress} from "@/components/ui/progress";

const BudgetProgress = ({initialBudget, currentExpenses}) => {
    const [isEditing, setEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString()||""
    );

    const percentUsed = initialBudget
    ? (currentExpenses/initialBudget.amount)*100
    : 0;

    const{
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
    } = useFetch(updateBudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);
        if(isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        await updateBudgetFn(amount);
    }

    useEffect(() => {
        if(updatedBudget?.success) {
            setEditing(false);
            toast.success("Budget updated successfully");
        }
    }, [updatedBudget]);

    useEffect(() => {
        if(error)
        {
            toast.error(error.message || "Failed to update budget");
        }
    }, [error]);

    const handleCancel= () => {
        setNewBudget(initialBudget?.amount?.toString()|| "");
        setEditing(false);
    }

    return (
        <Card className="hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle>Monthly Budget (Default Account)</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        {isEditing ?
                            (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-32 hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950"
                                        placeholder="Enter amount"
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                    <Button variant="ghost" size="icon" className="hover:bg-indigo-950" onClick={handleUpdateBudget} disabled={isLoading}>
                                        <Check className="w-4 h-4 text-green-300"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-indigo-950" onClick={handleCancel} disabled={isLoading}>
                                        <X className="w-4 h-4 text-red-300"/>
                                    </Button>
                                </div>
                            ) :
                            (
                                <>
                                    <CardDescription>
                                        {
                                            initialBudget
                                                ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                                                : "No budget set"
                                        }
                                    </CardDescription>
                                    <Button variant="ghost" size="icon" onClick={() => setEditing(true)}
                                            className={"h-6 w-6"}>
                                        <Pencil className="h-3 w-3"/>
                                    </Button>
                                </>
                            )
                        }
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {initialBudget && (
                    <div className="space-y-2">
                        <Progress
                            value={percentUsed}
                            extraStyles={`${
                                percentUsed >= 90
                                    ? "bg-red-500"
                                    : percentUsed >= 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                        />
                        <p className={`text-xs text-blue-200 text-right ${
                            percentUsed >= 90
                                ? "text-red-200"
                                : percentUsed >= 75
                                    ? "text-yellow-200"
                                    : "text-green-200"
                        }`}>{percentUsed.toFixed(1)}% used</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
export default BudgetProgress
