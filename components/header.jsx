import React from 'react'
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {AlignJustify, CircleDollarSign, Languages, LayoutDashboard, PenBox, Settings} from "lucide-react";
import {checkUser} from "@/lib/checkUser";
import ExchangeRateButton from "@/components/header/button-logik";
import Sidebar from "@/components/sidebar/sidebar";

// Funktion zur zufälligen Auswahl des Logos
const getRandomLogo = () => {
    const logos = [
        "/LOGO_SET_TEST/logo_test_1.png",
        "/LOGO_SET_TEST/logo_test_2.png",
        "/LOGO_SET_TEST/logo_test_3.png",
    ];
    const randomIndex = Math.floor(Math.random() * logos.length);
    return logos[randomIndex];
};

const Header = async () => {
    await checkUser();
    const logo = getRandomLogo();  // Zufälliges Logo auswählen

    return (
        <div className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b">
            <nav className="w-full py-4 px-2 flex items-center justify-between">
                <SignedIn>

                <Link href="/" className="flex items-center">
                    <Image
                        src={logo}
                        alt="Prudentis AI LOGO"
                        height={300}
                        width={300}
                        className="absolute top-0 left-8 bottom-0 m-auto"
                    />
                </Link>
                </SignedIn>
                <SignedOut>
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logo}
                            alt="Prudentis AI LOGO"
                            height={300}
                            width={300}
                            className="absolute top-0 left-0 bottom-0 m-auto"
                        />
                    </Link>
                </SignedOut>
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link href="/dashboard" className="text-gray-600 hover:text-yellow-500 flex items-center gap-2">
                            <Button variant="outline">
                                <LayoutDashboard size={18}/>
                                <span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transaction/create"
                              className="text-gray-600 hover:text-yellow-500 flex items-center gap-2">
                            <Button className="flex items-center gap-2">
                                <PenBox size={18}/>
                                <span className="hidden md:inline">Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <div className="flex items-center gap-2">
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button variant="outline" className="text-gray-600">Login</Button>
                        </SignInButton>

                        <SignUpButton forceRedirectUrl="/dashboard">
                            <Button variant="outline" className="text-gray-600">Sign Up</Button>
                        </SignUpButton>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <UserButton appearance={{
                            elements: {avatarBox: "h-10 w-10"},
                        }}/>
                    </SignedIn>
                </div>
            </nav>
        </div>

    );
};

export default Header;
