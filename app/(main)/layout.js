"use client" //Needed 4 Experimental BG

import React, { useEffect } from "react";

const MainLayout = ({ children }) => {

    //Experimental
    useEffect(() => {
        const backgrounds = [
            "/background.jpeg",
            "/background2.jpeg",
            "/background3.jpeg",
        ];

        const index = Math.floor(Math.random() * backgrounds.length);
        document.body.style.backgroundImage = `url('${backgrounds[index]}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }, []);

    //Main Page layout
    return <div className="container mx-auto my-32 text-white">{children}</div>;
};

export default MainLayout;
