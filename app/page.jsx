import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/app/_components/testimonials";

export default function Home() {
    return (
        <div className="mt-40">
            <HeroSection/>

            <section className="py-20 bg-black/20 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {statsData.map((statsData, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-yellow-600 mb-2">{statsData.value}</div>
                                <div className="text-white">{statsData.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-black/30">
                <div className="container mx-auto px-4">
                    <h2 className="roundend-lg bg-black/80 backdrop-blur-md z-1 py-2 pb-2 px-2 text-green-200 mb-4">
                        Everything you need to manage your finances
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuresData.map((feature, index) => (
                            <Card key={index}
                                  className="p-6 hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
                                <CardContent className="space-y-4 pt-4">
                                    {feature.icon}
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    <p className="text-yellow-200">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-black/40">
                <div className="container mx-auto px-4">
                    <h2 className="roundend-lg bg-black/80 backdrop-blur-md z-1 py-2 pb-2 px-2 text-blue-200 mb-8">
                        How it Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {howItWorksData.map((step, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-16 h-16 bg-white/80 backdrop-blur-md z-1 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-yellow-400">{step.title}</h3>
                                <p className="text-yellow-200">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-black/50">
                <div className="container mx-auto px-4">
                    <h2 className="roundend-lg bg-black/80 backdrop-blur-md z-1 py-2 pb-2 px-2 text-orange-200 mb-4">
                        What our users say
                    </h2>
                    <Testimonials/>
                </div>
            </section>

            <section className="py-20 bg-black/60">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="roundend-lg bg-black/80 backdrop-blur-md z-1 py-2 pb-2 px-2 text-purple-200 text-3xl font-bold mb-4">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="text-white mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already managing their finances smarter and faster with
                        Prudentis AI
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-black text-yellow-500 hover:bg-blue-950 animate-bounce">
                            Start Free Trial
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
