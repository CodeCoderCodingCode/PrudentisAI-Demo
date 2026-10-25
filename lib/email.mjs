import {Resend} from "resend";

export async function sendEmail({to, subject, react, html, text, idempotencyKey}, options = {}) {
  const apiKey = options.apiKey ?? process.env.RESEND_API_KEY;
  if (!apiKey) return {success: false, error: "RESEND_API_KEY is required to send email."};
  try {
    const client = options.createClient ? options.createClient(apiKey) : new Resend(apiKey);
    const requestHeaders = new Headers(client.headers);
    if (idempotencyKey) requestHeaders.set("Idempotency-Key", idempotencyKey);
    const {data, error} = await client.emails.send({
      from: process.env.RESEND_FROM || "Prudentis AI <onboarding@resend.dev>",
      to, subject, react, html, text,
    }, idempotencyKey ? {headers: requestHeaders} : undefined);
    if (error) return {success: false, error: error.message || "The email provider rejected the message."};
    if (!data?.id) return {success: false, error: "The email provider did not confirm message acceptance."};
    return {success: true, data};
  } catch (error) {
    return {success: false, error: error.message || "Email delivery failed."};
  }
}
