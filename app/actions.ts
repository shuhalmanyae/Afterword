"use server";

export async function sendReferralEmail(email: string, message: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(`[Mock Email] Sending referral to: ${email}`);
    console.log(`[Mock Email] Message content: ${message}`);

    // In a real app, integrate with Resend, SendGrid, etc.
    return { success: true };
}
