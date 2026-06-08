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
    const { orderId, card } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

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

    // If card details are provided, process payment directly (inside the site)
    if (card && card.number && card.expiry && card.cvc) {
      try {
        const [expMonthStr, expYearStr] = card.expiry.split('/');
        const expMonth = parseInt(expMonthStr.trim());
        let expYear = parseInt(expYearStr.trim());
        if (expYear < 100) {
          expYear = 2000 + expYear;
        }

        // 1. Create Payment Method
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: card.number.replace(/\s+/g, ''),
            exp_month: expMonth,
            exp_year: expYear,
            cvc: card.cvc,
          },
          billing_details: {
            name: card.name || order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
          }
        });

        // 2. Create and confirm PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.total_amount * 100), // convert to cents
          currency: 'brl',
          payment_method: paymentMethod.id,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          },
          metadata: {
            orderId: order.id.toString(),
          },
        });

        // 3. Update payment status to paid in Supabase
        await supabase
          .from('orders')
          .update({
            payment_status: 'pago_stripe_direto',
            stripe_session_id: paymentIntent.id
          })
          .eq('id', orderId);

        return res.status(200).json({ success: true });
      } catch (paymentErr) {
        console.error('Direct card payment error:', paymentErr);
        return res.status(400).json({ error: paymentErr.message });
      }
    }

    // Otherwise, fallback to Stripe Hosted Checkout Session
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
