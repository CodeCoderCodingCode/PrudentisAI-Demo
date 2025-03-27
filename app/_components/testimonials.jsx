'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { testimonialsData } from '@/data/landing';

const Testimonials = () => {
    return (
        <div
            className="testimonial-slider-wrapper overflow-hidden relative"
            onMouseEnter={() => document.querySelector(".testimonial-slider").style.animationPlayState = "paused"}
            onMouseLeave={() => document.querySelector(".testimonial-slider").style.animationPlayState = "running"}
        >
            <div className="testimonial-slider flex">
                {testimonialsData.map((testimonial, index) => (
                    <div key={index} className="testimonial-item w-full flex-shrink-0 px-4">
                        <Card className="p-6 hover:shadow-amber-100 transition-shadow hover:border-dashed border-indigo-950">
                            <CardContent className="pt-4 py-4">
                                <div className="flex items-center mb-4">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4 font-semibold py-2">
                                        <div>{testimonial.name}</div>
                                        <div className="text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-yellow-200">{testimonial.quote}</p>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
