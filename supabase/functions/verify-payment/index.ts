// Supabase Edge Function: Verify Payment
// Deploy with: supabase functions deploy verify-payment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
    orderId: string;
    txHash: string;
    chainId: number;
}

// Polygon RPC endpoints
const RPC_URLS: Record<number, string> = {
    137: "https://polygon-mainnet.g.alchemy.com/v2/demo", // Replace with your Alchemy key
    80001: "https://polygon-mumbai.g.alchemy.com/v2/demo", // Mumbai testnet
};

async function getTransactionReceipt(txHash: string, chainId: number) {
    const rpcUrl = RPC_URLS[chainId];
    if (!rpcUrl) throw new Error(`Unsupported chain: ${chainId}`);

    const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getTransactionReceipt",
            params: [txHash],
        }),
    });

    const data = await response.json();
    return data.result;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { orderId, txHash, chainId } = (await req.json()) as VerifyRequest;

        // Validate input
        if (!orderId || !txHash || !chainId) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get transaction receipt from blockchain
        const receipt = await getTransactionReceipt(txHash, chainId);

        if (!receipt) {
            return new Response(
                JSON.stringify({ error: "Transaction not found", status: "pending" }),
                { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Check if transaction was successful
        const success = receipt.status === "0x1";
        const blockNumber = parseInt(receipt.blockNumber, 16);
        const gasUsed = parseInt(receipt.gasUsed, 16);

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (success) {
            // Verify payment in database
            const { data, error } = await supabase.rpc("verify_payment", {
                p_order_id: orderId,
                p_tx_hash: txHash,
                p_block_number: blockNumber,
                p_gas_used: gasUsed,
            });

            if (error) {
                console.error("Database error:", error);
                return new Response(
                    JSON.stringify({ error: "Database update failed" }),
                    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    status: "paid",
                    blockNumber,
                    gasUsed,
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        } else {
            // Mark payment as failed
            await supabase.rpc("fail_payment", {
                p_order_id: orderId,
                p_error_message: "Transaction reverted on chain",
            });

            return new Response(
                JSON.stringify({
                    success: false,
                    status: "failed",
                    error: "Transaction reverted",
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
