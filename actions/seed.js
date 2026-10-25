"use server";

// Retained for old imports; seeding is now an explicit administrator CLI task.
export async function seedTransactions() {
  return {
    success: false,
    error: "Legacy seeding is disabled. Use npm run seed:demo -- --account-id <id> [--apply] on the administrator's machine.",
  };
}