export async function GET() {
    return Response.json(
        { error: "Legacy seeding is disabled. Add fictional transactions through the account interface." },
        { status: 410 }
    );
}
