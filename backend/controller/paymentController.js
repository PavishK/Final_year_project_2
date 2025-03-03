import Stripe from 'stripe';
import handler from 'express-async-handler';
import env from 'dotenv';
env.config();

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

export const Card_Payment=handler(async (req, res) => {
    console.log("Payment Attempt");

    try {
        const { cartItems, email, discountCode, shippingCode } = req.body;

        if (!cartItems || !email) {
            return res.status(400).json({ message: "Missing cartItems or email" });
        }

        // Convert cart items to Stripe line items
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            shipping_options: [{ shipping_rate: shippingCode }],
            discounts: [discountCode],
            success_url: 'http://localhost:4200/success',
            cancel_url: 'http://localhost:4200/cancel',
            customer_email: email,
        });

        res.status(200).json({ url: session.url });

    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ message: error.message, error: true });
    }
});