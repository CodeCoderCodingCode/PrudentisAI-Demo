"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const images = [
    "/BG_SET_404/bg_404_1.jpeg",
    "/BG_SET_404/bg_404_2.jpeg",
    "/BG_SET_404/bg_404_3.jpeg",
    "/BG_SET_404/bg_404_4.jpeg",
    "/BG_SET_404/bg_404_5.jpeg",
    "/BG_SET_404/bg_404_6.jpeg",
    "/BG_SET_404/bg_404_7.jpeg",
    "/BG_SET_404/bg_404_8.jpeg",
    "/BG_SET_404/bg_404_9.jpeg",
    "/BG_SET_404/bg_404_10.jpeg",
    "/BG_SET_404/bg_404_11.jpeg",
    "/BG_SET_404/bg_404_12.jpeg",
];

const NotFound = () => {
    const [bgImage, setBgImage] = useState("");

    useEffect(() => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBgImage(randomImage);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center text-white">
            {/* Hintergrundbild */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Overlay + Weichzeichner */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />

            {/* Inhalt */}
            <div className="relative z-10">
                <h1 className="text-6xl font-bold gradient-title mb-4 animate-[wave_2s_infinite] hover:animate-pulse hover:cursor-help">
                    404
                </h1>
                <h2 className="text-4xl font-semibold gradient-sub-title mb-4 animate-[wave_2s_infinite] hover:animate-pulse hover:cursor-help">
                    Page Not Found
                </h2>
                <p className="text-yellow-200 mb-8 text-2xl animate-[wave_3s_infinite] hover:animate-pulse hover:cursor-help">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button
                        size="lg"
                        className="transition-transform duration-500 ease-out bg-black/70 hover:bg-yellow/200 hover:text-green-300 hover:shadow-amber-100 group relative cursor-pointer hover:border-dashed border-indigo-950 hover:scale-125"
                    >
                        Return Home
                    </Button>
                </Link>
            </div>

            {/* Wavy Animation für den Text */}
            <style>
                {`
          @keyframes wave {
            0% { transform: translateY(0px); }
            25% { transform: translateY(-5px); }
            50% { transform: translateY(5px); }
            75% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
        `}
            </style>
        </div>
    );
};

export default NotFound;
