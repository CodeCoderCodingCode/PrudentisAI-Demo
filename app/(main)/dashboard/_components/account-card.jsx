"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/accounts";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const AccountCard = ({ account, selected, onSelect }) => {
    const { name, type, balance, id, isDefault } = account;

    const {
        data: updatedAccount,
        error,
        fn: updateAccountFn,
        loading: updateAccountLoading,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("You need at least one default account");
            return;
        }

        await updateAccountFn(id);
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Account updated successfully");
        }
    }, [updatedAccount, updateAccountLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        }
    }, [error]);

    return (
        <div className="relative">
            <Card className="hover:shadow-amber-100 transition-shadow group cursor-pointer hover:border-dashed border-indigo-950">
                <Link href={`/account/${id}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>{name}</CardTitle>
                        <Switch
                            className="!bg-black data-[state=checked]:!bg-yellow-500 [&>*]:!bg-yellow-500 data-[state=checked]:[&>*]:!bg-black hover:shadow-amber-100 transition-shadow group relative cursor-pointer border-indigo-950"
                            onClick={handleDefaultChange}
                            disabled={updateAccountLoading}
                            checked={isDefault}
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${parseFloat(balance).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {type.charAt(0) + type.slice(1).toLowerCase()} Account
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                            Income
                        </div>
                        <div className="flex items-center">
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                            Expense
                        </div>
                    </CardFooter>
                </Link>
                {/* Checkbox nur anzeigen, wenn onSelect übergeben wurde (Bulk-Modus) */}
                {onSelect && (
                    <div className="absolute bottom-1 right-2">
                        <Checkbox
                            className="hover:shadow-amber-100 transition-shadow cursor-pointer hover:border-dashed border-indigo-950"
                            checked={selected}
                            onCheckedChange={() => onSelect(id)}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AccountCard;
