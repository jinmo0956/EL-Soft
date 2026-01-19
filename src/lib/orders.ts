import { supabase } from './supabase';

export interface Order {
    id: string;
    wallet_address: string;
    product_id: string;
    product_name: string | null;
    amount: number;
    tx_hash: string | null;
    chain_id: number;
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
    created_at: string;
    paid_at: string | null;
}

/**
 * Create a new order
 */
export async function createOrder(
    walletAddress: string,
    productId: string,
    productName: string,
    amount: number,
    chainId: number = 137
): Promise<string | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.rpc('create_order', {
        p_wallet_address: walletAddress.toLowerCase(),
        p_product_id: productId,
        p_product_name: productName,
        p_amount: amount,
        p_chain_id: chainId,
    });

    if (error) {
        console.error('Error creating order:', error);
        return null;
    }

    return data;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) return null;
    return data;
}

/**
 * Get orders by wallet address
 */
export async function getOrdersByWallet(walletAddress: string): Promise<Order[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

/**
 * Update order with transaction hash (client-side, before verification)
 */
export async function updateOrderTxHash(
    orderId: string,
    txHash: string
): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('orders')
        .update({
            tx_hash: txHash,
            status: 'processing'
        })
        .eq('id', orderId);

    return !error;
}

/**
 * Verify payment via Edge Function
 */
export async function verifyPayment(
    orderId: string,
    txHash: string,
    chainId: number = 137
): Promise<{ success: boolean; status: string; error?: string }> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ orderId, txHash, chainId }),
            }
        );

        return await response.json();
    } catch (error) {
        return {
            success: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
