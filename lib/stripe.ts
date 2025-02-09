import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
    throw new Error("STRIPE_API_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: "2025-01-27.acacia",
    typescript: true
});