/* ============================================
   R.P WOOD — Supabase Client & Integrations
   ============================================ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://fhneyjhkxpgjzyirdjza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobmV5amhreHBnanp5aXJkanphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODIyMTksImV4cCI6MjA5NjE1ODIxOX0.0t2I4p4wQfZ7lmjv-0s5DUW5WrmUW3mlUB4k7Y0hSHU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch products from database
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Erro ao buscar produtos do Supabase:', error);
    return [];
  }
  return data;
}

// Save order to database
export async function saveOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        shipping_address: {
          cep: orderData.cep,
          address: orderData.address,
          number: orderData.num,
          complement: orderData.comp || '',
          neighborhood: orderData.neighborhood,
          city: orderData.city,
          state: orderData.state
        },
        items: orderData.items,
        total_amount: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus || 'pending'
      }
    ])
    .select();

  if (error) {
    console.error('Erro ao salvar pedido no Supabase:', error);
    throw error;
  }
  return data[0];
}
