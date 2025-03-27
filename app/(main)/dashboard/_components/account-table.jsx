"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash, X, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import AccountCard from "./account-card";
import { bulkDeleteAccounts } from "@/actions/accounts";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";

const BulkAccountActions = ({ accounts }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const { loading: deleteLoading, fn: deleteFn } = useFetch(bulkDeleteAccounts);

    // Filtere Accounts anhand des Suchbegriffs und Typs
    const filteredAccounts = useMemo(() => {
        let result = [...accounts];
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter((acc) => acc.name.toLowerCase().includes(lowerSearch));
        }
        if (typeFilter) {
            result = result.filter((acc) => acc.type === typeFilter);
        }
        return result;
    }, [accounts, searchTerm, typeFilter]);

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredAccounts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredAccounts.map((acc) => acc.id));
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} accounts?`)) {
            return;
        }
        const result = await deleteFn(selectedIds);
        console.log("Bulk delete result:", result); // Zum Debuggen

        // Wenn kein Fehler vorhanden ist, nehmen wir an, dass die Löschung erfolgreich war
        if (!result?.error && (result?.data?.success || true)) {
            toast.success("Accounts deleted successfully");
            setSelectedIds([]);
            // Optional: Aktualisiere hier deinen Account-State, falls nötig
        } else {
            toast.error(result?.error || "Failed to delete accounts");
        }
    };



    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setSelectedIds([]);
    };

    return (
        <div className="space-y-4">
            {/* Such-/Filterleiste und Bulk‑Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-200" />
                    <Input
                        placeholder="Search accounts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-yellow-200 bg-black/80 hover:bg-black/50 hover:shadow-amber-100 transition-shadow group cursor-pointer border-none"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px] border-none focus:ring-0 text-yellow-300 focus:outline-none bg-black/80 hover:bg-black/50 hover:shadow-amber-100 transition-shadow group cursor-pointer border-none">
                            <SelectValue
                                placeholder="All Types"
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-yellow-300 transition-shadow group cursor-pointer border-none">
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CURRENT">Current</SelectItem>
                        </SelectContent>
                    </Select>
                    {selectedIds.length > 0 && (
                        <>
                            <Button onClick={handleSelectAll}>
                                {selectedIds.length === filteredAccounts.length ? "Deselect All" : "Select All"}
                            </Button>
                            <Button variant="destructive" onClick={handleBulkDelete} disabled={deleteLoading}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedIds.length})
                            </Button>
                        </>
                    )}
                    {(searchTerm || typeFilter) && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters" className="text-yellow-500 hover:text-yellow-200 hover:bg-black/80 ">
                            <X className="h-4 w-4 text-yellow-500 hover:text-yellow-300" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Accounts Grid inkl. Create Account Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CreateAccountDrawer>
                    <Card className="hover:shadow-amber-100 transition-shadow cursor-pointer hover:border-dashed border-indigo-950">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                            <Plus className="h-10 w-10 mb-2" />
                            <p className="text-sm font-medium text-yellow-200">Add New Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>
                {filteredAccounts.length === 0 ? (
                    <p className="gradient-sub-title">No accounts found...</p>
                ) : (
                    filteredAccounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            selected={selectedIds.includes(account.id)}
                            onSelect={handleSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default BulkAccountActions;
