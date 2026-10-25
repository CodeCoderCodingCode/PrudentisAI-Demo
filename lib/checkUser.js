import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/lib/prisma";
import {cache} from "react";


export const checkUser = cache(async() => {
    const user =await currentUser();

    if(!user) {
        return null;
    }

    try{
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
                },
        });

        if(loggedInUser) {
            return loggedInUser;
            }


        const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Prudentis user";
        const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
        if (!email) throw new Error("An email address is required to create your profile.");

        // Layouts and pages may render concurrently on the first signed-in request.
        const newUser = await db.user.upsert({
            where: {clerkUserId: user.id},
            update: {},
            create: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email,
            },
            });

        return newUser;
    }catch (error) {
        console.log(error.message);
        throw new Error("Could not initialize your Prudentis profile.");
    }
});
