import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WebsiteClientPayload {
  first_name: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+?\d{7,15}$/.test(cleaned);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: WebsiteClientPayload = await req.json();

    // Validate required fields
    if (!body.first_name || body.first_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "First name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.email && !validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.phone && !validatePhone(body.phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.message && body.message.trim().length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role key (server-side only) to insert into customers
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Build notes from service + message
    const notesParts: string[] = [];
    if (body.service) notesParts.push(`Послуга: ${body.service}`);
    if (body.message) notesParts.push(`Повідомлення: ${body.message.trim()}`);
    const notes = notesParts.length > 0 ? notesParts.join("\n") : null;

    const { data, error } = await supabase
      .from("customers")
      .insert({
        first_name: body.first_name.trim(),
        last_name: body.last_name?.trim() || null,
        company: body.company?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        source: "ALEXORA STUDIO website",
        status: "new",
        assigned_to: null,
        created_by: null,
        notes,
      })
      .select("id, first_name, last_name, email, phone, source, status, created_at")
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to create client" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, client: data }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
