import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a nullable client - will be null if env vars are not configured
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Types for our database
export interface User {
    wallet_address: string;
    created_at: string;
    nickname: string | null;
    email: string | null;
    last_login: string | null;
}

export interface UserPurchase {
    id: string;
    wallet_address: string;
    product_id: string;
    purchased_at: string;
    license_key: string | null;
}

// User operations
export async function getUser(walletAddress: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

    if (error) return null;
    return data;
}

export async function createOrUpdateUser(walletAddress: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('users')
        .upsert(
            {
                wallet_address: walletAddress.toLowerCase(),
                last_login: new Date().toISOString(),
            },
            { onConflict: 'wallet_address' }
        )
        .select()
        .single();

    if (error) {
        console.error('Error creating/updating user:', error);
        return null;
    }
    return data;
}

export async function getUserPurchases(walletAddress: string): Promise<UserPurchase[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('purchased_at', { ascending: false });

    if (error) return [];
    return data || [];
}
