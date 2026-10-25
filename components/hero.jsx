"use client"

import React, {useEffect, useRef} from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {

    const imageRef = useRef();

    useEffect(() => {
        const imageElement = imageRef.current;
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled");
            }else{imageElement.classList.remove("scrolled");}
        }

        window.addEventListener("scroll",handleScroll);

        return () => window.removeEventListener("scroll",handleScroll);
    }, []);

    return (
        <div className="pb-20 px-4">
            <div className="container mx-auto text-center text-white">
                <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 text-yellow-500 gradient-title">
                    Manage Your Finances with Prudentis AI
                </h1>
                <p className="roundend-lg bg-black/80 backdrop-blur-md z-1 py-2 pb-2  gradient-sub-title">
                    An AI-powered financial management plattform that helps you manage, track and analyze your finances effectively and optimize your spending with real-time insights.
                </p>
                <div className="flex w-full items-center justify-center gap-4 py-2" >
                    <Link href="/sign-up">
                        <Button variant="outline" className="text-gray-600">Get Started</Button>
                    </Link>
                    <Link href="https://github.com/CodeCoderCodingCode/PrudentisAI-Demo/blob/main/docs/DEMO.md">
                        <Button>Request Demo</Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper">
                    <div ref = {imageRef} className="hero-image">
                    <Image src="/banner.jpeg" alt="Prudentis AI robot illustration" width={1280} height={720} className=" rounded-lg shadow-2xl border mx-auto" priority/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HeroSection
