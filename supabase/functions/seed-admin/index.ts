import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const email = "adminteste1212@gmail.com";
    const password = "adminteste1212";

    // Check if already exists
    const { data: existing } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (existing) {
      // Just ensure role is admin
      await supabase.from("user_roles").update({ role: "admin" }).eq("user_id", existing.id);
      return new Response(JSON.stringify({ success: true, message: "Admin já existia, role atualizado." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user via admin API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Admin Teste" },
    });
    if (createError) throw createError;

    // Update role to admin (trigger already created 'client' role)
    const { error: roleError } = await supabase
      .from("user_roles")
      .update({ role: "admin" })
      .eq("user_id", userData.user.id);
    if (roleError) throw roleError;

    return new Response(JSON.stringify({ success: true, message: "Admin criado com sucesso!", userId: userData.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
