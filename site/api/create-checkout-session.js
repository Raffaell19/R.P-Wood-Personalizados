import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // 1. Fetch order details from Supabase using Service Role (bypassing RLS)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return res.status(404).json({ error: 'Order not found' });
    }

    // 2. Map items to Stripe line items format
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // convert to cents
      },
      quantity: item.qty,
    }));

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      automatic_payment_methods: {
        enabled: true,
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout.html?success=true&session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${req.headers.origin}/checkout.html?canceled=true&order_id=${order.id}`,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    return res.status(500).json({ error: err.message });
  }
}
