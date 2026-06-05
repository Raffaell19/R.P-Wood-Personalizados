import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the completed checkout session event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    
    // Determine payment details from Stripe session
    const paymentMethodType = session.payment_method_types?.[0] || 'card';
    const paymentStatus = paymentMethodType === 'pix' ? 'pago_pix' : 'pago_stripe';
    const paymentMethod = 'stripe_' + paymentMethodType;

    if (orderId) {
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          payment_method: paymentMethod,
        })
        .eq('id', orderId);

      if (error) {
        console.error(`Failed to update order ${orderId} in Supabase:`, error);
        return res.status(500).json({ error: 'Database update failed' });
      }
      console.log(`Order ${orderId} successfully marked as ${paymentStatus}`);
    }
  }

  return res.status(200).json({ received: true });
}
