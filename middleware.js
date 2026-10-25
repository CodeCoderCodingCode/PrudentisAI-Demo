import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import arcjet, {createMiddleware, detectBot, shield} from "@arcjet/next";
import {NextResponse} from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)",
])

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules:[
        // Protect against common attacks with Arcjet Shield
        shield({
            mode: 'LIVE' // will block requests. Use "DRY_RUN" to log only
        }),
        detectBot({
            mode: "LIVE",
            allow:["GO_HTTP"] //Search engines BLOCKED ^^
        }),
    ],
});

const clerk = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export default createMiddleware(aj, clerk);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
