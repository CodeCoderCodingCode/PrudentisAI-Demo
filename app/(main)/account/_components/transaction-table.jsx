"use client"

import React, {useEffect, useMemo, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {format} from "date-fns";
import {categoryColors} from "@/data/categories";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {
    ChevronDown,
    ChevronLeft, ChevronRight,
    ChevronsUp,
    ChevronUp,
    Clock,
    MoreHorizontal,
    RefreshCw,
    Search,
    Trash,
    X
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import {bulkDeleteTransactions} from "@/actions/accounts";
import {toast} from "sonner";
import {BarLoader} from "react-spinners";

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
}

const TransactionTable = ({transactions}) => {
const router = useRouter();

const [selectedIds, setSelectedIds] = useState([]);
const [sortConfig, setSortConfig] = useState({
    field:"date",
    direction:"desc",
});

    const[searchTerm, setSearchTerm] = useState("");
    const[typeFilter, setTypeFilter] = useState("");
    const[recurringFilter, setRecurringFilter] = useState("");

    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState(1);

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions);

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        //Apply Search Filter
        if(searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
                transaction.description?.toLowerCase().includes(searchLower)
            );
        }

        //Apply Recurring Filter
        if(recurringFilter) {
            result = result.filter((transaction) => {
            if(recurringFilter === "recurring") return transaction.isReccurring;
                return !transaction.isReccurring;
            });

        }

        //Apply Type Filter
        if(typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
        }

        //Apply Sorting
        result.sort((a,b) => {
                let comparison = 0;

                switch (sortConfig.field) {
                    case "date":
                        comparison = new Date(a.date) - new Date(b.date);
                        break;
                    case "amount":
                        comparison = a.amount - b.amount;
                        break;
                    case "category":
                        comparison = a.category.localeCompare(b.category);
                        break;
                    default:
                        comparison = 0;
                        break;
                }

                return sortConfig.direction === "asc" ? comparison : -comparison;
        });


        return result;
    },[
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig
    ]);

    // Pagination-Berechnungen
    const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedTransactions, currentPage]);


    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction :
                current.field == field && current.direction === "asc"?"desc":"asc",
        }));
        setCurrentPage(1); // Seite zurücksetzen
    }

    const handleSelect = (id) => {
        setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    }

    const handleSelectAll = () => {
        setSelectedIds((current) => current.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id));
    }

    const handleBulkDelete = async () => {
        if(
            !window.confirm(
                `Are you sure you want to delete ${selectedIds.length} transactions?`
            )
        ) {
            return;
        }

        deleteFn(selectedIds);
    };

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
            setSelectedIds([]); // Auswahl zurücksetzen
        }
    }, [deleted, deleteLoading]);


    const handleClearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectedIds([]);
        setCurrentPage(1);
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedIds([]); // Optional: Auswahl bei Seitenwechsel zurücksetzen
    };


    return (
        <div className="space-y-4 ">
            {deleteLoading && (<BarLoader className="mt-4" width={"100%"} color={"#9333ea"}/>)}

            {/*Filters*/}
            <div className="flex flex-col sm:flex-row gap-4 ">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Setzt die Seite zurück
                        } }
                        className="pl-8"/>
                </div>

                <div className="flex gap-2">
                    <Select value={typeFilter} onValueChange={(value) => {
                        setTypeFilter(value);
                        setCurrentPage(1); // Seite zurücksetzen
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={(value) => {
                        setRecurringFilter(value);
                        setCurrentPage(1); // Setzt die Seite zurück
                    }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedIds.length > 0 &&
                        <div className="flex items-center gap-2">
                            <Button variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}>
                                <Trash className="h-4 w-4 mr-2"/>
                                Delete Selected ( {selectedIds.length} )
                            </Button>
                        </div>
                    }

                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Clear Filters">
                            <X className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            </div>
            {/*Transactions*/}
            <div className="rounded-md border">
                <Table>
                    <TableHeader >
                        <TableRow >
                            <TableHead className="w-[50px]">
                                <Checkbox onCheckedChange={handleSelectAll} checked={selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0}/>
                            </TableHead>

                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                <div className= "flex items-center text-amber-200">Date {sortConfig.field === "date"&&(
                                    sortConfig.direction === "asc"? <ChevronUp className="ml-1 h-4 w-4"/>:<ChevronDown className="ml-1 h-4 w-4"/>

                                )}</div>
                            </TableHead>

                            <TableHead className="text-amber-200">Description</TableHead>

                            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                                <div className= "flex items-center text-amber-200">Category {sortConfig.field === "category"&&(
                                    sortConfig.direction === "asc"? <ChevronUp className="ml-1 h-4 w-4"/>:<ChevronDown className="ml-1 h-4 w-4"/>

                                )}</div>
                            </TableHead>

                            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                                <div className= "flex items-center justify-end text-amber-200">Amount {sortConfig.field === "amount"&&(
                                    sortConfig.direction === "asc"? <ChevronUp className="ml-1 h-4 w-4"/>:<ChevronDown className="ml-1 h-4 w-4"/>

                                )}</div>
                            </TableHead>

                            <TableHead className="w-[50px] text-amber-200">Recurring</TableHead>

                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.length === 0? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-yellow-200">
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox onCheckedChange={() => handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)}/>
                                    </TableCell>

                                    <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>

                                    <TableCell>{transaction.description}</TableCell>

                                    <TableCell className="capitalize">
                                        <span style={{
                                            background: categoryColors[transaction.category],
                                        }}
                                        className="px-2 py-1 rounded text-white text-sm"
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right font-medium" style={{color: transaction.type === "EXPENSE" ? "#ff7f7f" : "#7fff7f"}}>

                                    {transaction.type === "EXPENSE" ? "-" : "+"}
                                        ${transaction.amount.toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        {transaction.isReccurring ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="outline" className="gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 whitespace-nowrap flex items-center">
                                                            <RefreshCw className="w-3 h-3"/>
                                                            {RECURRING_INTERVALS[transaction.reccurringInterval]}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-sm">
                                                            <div className="font-medium">Next Date:</div>
                                                            <div>
                                                                {format(new Date(transaction.nextRecurringDate),"PP")}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge variant="outline" className="gap-1 text-yellow-200 whitespace-nowrap flex items-center">
                                                <Clock className="w-3 h-3"/>
                                                One-time
                                            </Badge>


                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <div className="w-8 h-8 p-0 flex items-center justify-center cursor-pointer hover:bg-white hover:rounded-md hover:text-black">
                                                    <MoreHorizontal className="w-4 h-4 "/>
                                                </div>
                                            </DropdownMenuTrigger>



                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem onClick={() => router.push(
                                                    `/transaction/create?edit=${transaction.id}`
                                                )}>
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => deleteFn([transaction.id])}
                                                     >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

            </div>
        </div>
    )
}
export default TransactionTable
