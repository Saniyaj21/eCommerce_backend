import stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY
const stripeInstance = stripe(apiKey);

export const processPayment = async (req, res) => {
    try {
        const myPayment = await stripeInstance.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "Ecommerce",
            },
        });

        res
            .status(200)
            .json({ success: true, client_secret: myPayment.client_secret });

    } catch (error) {
        res.status(400)
            .json({ success: false, message: error.message });
    }
}

export const sendStripeApiKey = async (req, res) => {

    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
}