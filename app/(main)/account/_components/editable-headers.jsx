"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

// Importiere die neuen Server-Aktionen
import { updateAccountName, updateAccountType, updateAccountBalance } from "@/actions/accounts";

export const EditableAccountName = ({ initialName, onSave }) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(initialName);

    const handleConfirm = async () => {
        await onSave(name);
        setEditMode(false);
    };

    const handleCancel = () => {
        setName(initialName);
        setEditMode(false);
    };

    return (
        <div className="relative group">
            {editMode ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Account Name"
                    />
                    <Button onClick={handleConfirm} variant="ghost">
                        <Check size={16} />
                    </Button>
                    <Button onClick={handleCancel} variant="ghost">
                        <X size={16} />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center">
                    <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
                        {name}
                    </h1>
                    <Button
                        variant="ghost"
                        className="invisible group-hover:visible ml-2"
                        onClick={() => setEditMode(true)}
                    >
                        <Pencil size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export const EditableAccountType = ({ initialType, onSave }) => {
    const [editMode, setEditMode] = useState(false);
    const [type, setType] = useState(initialType);

    const handleConfirm = async () => {
        await onSave(type);
        setEditMode(false);
    };

    const handleCancel = () => {
        setType(initialType);
        setEditMode(false);
    };

    return (
        <div className="relative group">
            {editMode ? (
                <div className="flex items-center gap-2">
                    <Select value={type} onValueChange={(val) => setType(val)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CURRENT">Current</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleConfirm} variant="ghost">
                        <Check size={16} />
                    </Button>
                    <Button onClick={handleCancel} variant="ghost">
                        <X size={16} />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center">
                    <p className="text-lg text-yellow-300">
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                    <Button
                        variant="ghost"
                        className="invisible group-hover:visible ml-2"
                        onClick={() => setEditMode(true)}
                    >
                        <Pencil size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export const EditableBalanceChange = ({ initialBalance, onSave }) => {
    const [editMode, setEditMode] = useState(false);
    const [balance, setBalance] = useState(initialBalance);

    const handleConfirm = async () => {
        await onSave(Number(balance));
        setEditMode(false);
    };

    const handleCancel = () => {
        setBalance(initialBalance);
        setEditMode(false);
    };

    return (
        <div className="relative group">
            {editMode ? (
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Balance"
                    />
                    <Button onClick={handleConfirm} variant="ghost">
                        <Check size={16} />
                    </Button>
                    <Button onClick={handleCancel} variant="ghost">
                        <X size={16} />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center">
                    <div className="text-xl sm:text-2xl font-bold text-right">
                        ${parseFloat(balance).toFixed(2)}
                    </div>
                    <Button
                        variant="ghost"
                        className="invisible group-hover:visible ml-2"
                        onClick={() => setEditMode(true)}
                    >
                        <Pencil size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};

/**
 * EditableAccountHeader
 * – Diese Wrapper-Komponente ruft die Server-Aktionen in den onSave-Handlern auf.
 */
export const EditableAccountHeaderL = ({ account }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleNameSave = async (newName) => {
        const result = await updateAccountName(account.id, newName);
        if (!result.success) {
            console.error("Error updating name:", result.error);
        }
        startTransition(() => router.refresh());
    };

    const handleTypeSave = async (newType) => {
        const result = await updateAccountType(account.id, newType);
        if (!result.success) {
            console.error("Error updating type:", result.error);
        }
        startTransition(() => router.refresh());
    };

    return (
        <div>
            <EditableAccountName initialName={account.name} onSave={handleNameSave}/>
            <EditableAccountType initialType={account.type} onSave={handleTypeSave}/>
        </div>
    );
};

export const EditableAccountHeaderR = ({ account }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleBalanceSave = async (newBalance) => {
        const result = await updateAccountBalance(account.id, newBalance);
        if (!result.success) {
            console.error("Error updating balance:", result.error);
        }
        startTransition(() => router.refresh());
    };

    return (
        <div>
            <div>
                <EditableBalanceChange
                    initialBalance={account.balance}
                    onSave={handleBalanceSave}
                />
                <div className="grid-cols-2">
                    <p className="text-sm text-yellow-300">
                        {account._count.transactions} Transactions
                    </p>
                </div>
            </div>
        </div>
    );
};
