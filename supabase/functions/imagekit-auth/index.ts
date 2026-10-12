// Supabase Edge Function: imagekit-auth
// Serves: Signed client upload parameters for ImageKit with HMAC-SHA1

import { createHmac } from "node:crypto";

const IMAGEKIT_PRIVATE_KEY = Deno.env.get("IMAGEKIT_PRIVATE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!IMAGEKIT_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: "IMAGEKIT_PRIVATE_KEY secret is not set in Supabase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes expiration
    const stringToSign = token + expire;

    const signature = createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
      .update(stringToSign)
      .digest("hex");

    return new Response(
      JSON.stringify({
        token,
        expire,
        signature,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
