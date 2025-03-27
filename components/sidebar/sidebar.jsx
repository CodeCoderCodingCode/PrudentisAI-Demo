"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignJustify, CircleDollarSign, Languages, Settings, X } from "lucide-react";
import ExchangeRateButton from "@/components/header/button-logik";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Button zum Öffnen der Sidebar */}
            <Button variant="ghost" className="text-yellow-200 rounded-full w-10 h-10" onClick={() => setIsOpen(true)}>
                <AlignJustify />
            </Button>

            {/* Overlay und Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50">
                    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg p-4 flex flex-col space-y-4">
                        {/* Schließen-Button */}
                        <Button variant="ghost" className="text-yellow-200 self-end" onClick={() => setIsOpen(false)}>
                            <X />
                        </Button>

                        {/* Sidebar-Buttons */}
                        <Button variant="ghost" className="text-yellow-200 w-full flex justify-start">
                            <Settings className="mr-2" /> Settings
                        </Button>
                        <ExchangeRateButton />
                        <Button variant="ghost" className="text-yellow-200 w-full flex justify-start">
                            <Languages className="mr-2" /> Language
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
