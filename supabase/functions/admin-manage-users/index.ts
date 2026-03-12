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
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Não autorizado");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !caller) throw new Error("Token inválido");

    const { data: callerRole } = await supabaseAdmin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (!callerRole) throw new Error("Acesso negado: apenas administradores");

    const body = await req.json();
    const { action, userId, role, reason, email: newEmail, password: newPassword, fullName } = body;

    switch (action) {
      case "list_users": {
        const { data: profiles, error } = await supabaseAdmin
          .from("profiles")
          .select("id, email, full_name, created_at, banned_at, banned_reason, avatar_url");
        if (error) throw error;

        // Get roles for all users
        const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
        const roleMap: Record<string, string> = {};
        (roles || []).forEach((r: any) => { roleMap[r.user_id] = r.role; });

        const users = (profiles || []).map((p: any) => ({
          ...p,
          role: roleMap[p.id] || "client",
        }));

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "change_role": {
        if (!userId || !role) throw new Error("userId e role são obrigatórios");
        if (!["admin", "client"].includes(role)) throw new Error("Role inválida");
        if (userId === caller.id) throw new Error("Você não pode alterar seu próprio role");

        const { error } = await supabaseAdmin
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true, message: `Role alterado para ${role}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "ban_user": {
        if (!userId) throw new Error("userId é obrigatório");
        if (userId === caller.id) throw new Error("Você não pode banir a si mesmo");

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ banned_at: new Date().toISOString(), banned_reason: reason || "Violação dos termos" })
          .eq("id", userId);
        if (error) throw error;

        // Also ban in auth
        await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });

        return new Response(JSON.stringify({ success: true, message: "Usuário banido" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "unban_user": {
        if (!userId) throw new Error("userId é obrigatório");

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ banned_at: null, banned_reason: null })
          .eq("id", userId);
        if (error) throw error;

        await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: "none" });

        return new Response(JSON.stringify({ success: true, message: "Usuário desbanido" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_admin": {
        if (!newEmail || !newPassword) throw new Error("email e password são obrigatórios");

        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: newEmail,
          password: newPassword,
          email_confirm: true,
          user_metadata: { full_name: fullName || "Admin" },
        });
        if (createErr) throw createErr;

        await supabaseAdmin.from("user_roles").update({ role: "admin" }).eq("user_id", newUser.user.id);

        return new Response(JSON.stringify({ success: true, message: `Admin ${email} criado com sucesso!` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_user": {
        if (!userId) throw new Error("userId é obrigatório");
        if (userId === caller.id) throw new Error("Você não pode deletar sua própria conta");

        await supabaseAdmin.auth.admin.deleteUser(userId);

        return new Response(JSON.stringify({ success: true, message: "Usuário deletado permanentemente" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
