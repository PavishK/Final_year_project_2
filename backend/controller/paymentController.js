import Stripe from 'stripe';
import handler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const Card_Payment_Controller = handler(async (req, res) => {
    console.log("🔹 Request Received for Card Payment:", req.body);

    try {
        const { cartData, costData, userInfo } = req.body;

        // Validate cart data
        if (!Array.isArray(cartData) || cartData.length === 0) {
            return res.status(400).json({ error: "Cart data is empty or invalid" });
        }

        // Validate cost data
        if (!costData || typeof costData.total !== 'number' || costData.total <= 0) {
            return res.status(400).json({ error: "Invalid cost data" });
        }

        // Validate user info
        if (!userInfo || !userInfo.userId || !userInfo.userName || !userInfo.phno || !userInfo.address) {
            return res.status(400).json({ error: "Invalid user information" });
        }

        // Convert total amount to cents (Stripe uses cents)
        const totalAmount = Math.round(costData.total * 100);

        console.log(`✅ Processing Payment: ₹${costData.total} (Converted to ${totalAmount} paise)`);

        // Create Payment Intent
        // Create Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "inr",
    payment_method_types: ["card"],
    metadata: {
        userId: userInfo.userId,
        name: userInfo.userName,
        phone: userInfo.phno,
        totalAmount: costData.total,
        orderSummary: cartData.map(item => `${item.productName} x${item.productQuantity}`).join(", "),
    },
});


        console.log("✅ Payment Intent Created:", paymentIntent.id);

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("❌ Payment Error:", error.message);
        res.status(500).json({ error: "Payment failed: " + error.message });
    }
});
