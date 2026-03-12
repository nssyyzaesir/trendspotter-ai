import { useState, useEffect } from "react";
import { Users, Shield, ShieldOff, Ban, Unlock, Trash2, Search, UserCheck, UserX, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  banned_at: string | null;
  banned_reason: string | null;
  role: string;
}

const AdminUsersTab = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-users", {
        body: { action: "list_users" },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (err: any) {
      toast.error("Erro ao carregar usuários: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (action: string, userId: string, extra?: Record<string, string>) => {
    const confirmMessages: Record<string, string> = {
      ban_user: "Deseja realmente banir este usuário?",
      unban_user: "Deseja desbanir este usuário?",
      delete_user: "⚠️ AÇÃO IRREVERSÍVEL! Deseja deletar permanentemente este usuário?",
      change_role: `Deseja alterar o role para ${extra?.role}?`,
    };
    if (!confirm(confirmMessages[action] || "Confirmar ação?")) return;

    setActionLoading(userId);
    try {
      let reason: string | undefined;
      if (action === "ban_user") {
        reason = prompt("Motivo do banimento:") || "Violação dos termos";
      }

      const { data, error } = await supabase.functions.invoke("admin-manage-users", {
        body: { action, userId, reason, ...extra },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success(data.message);
      fetchUsers();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const bannedCount = users.filter((u) => u.banned_at).length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div>
      {/* User Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold text-primary">{totalUsers}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold text-accent">{adminCount}</p>
          <p className="text-xs text-muted-foreground">Admins</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold text-destructive">{bannedCount}</p>
          <p className="text-xs text-muted-foreground">Banidos</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuário</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Cadastro</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.full_name || "Sem nome"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.role === "admin" ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.banned_at ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        <UserX className="h-3 w-3" /> Banido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <UserCheck className="h-3 w-3" /> Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {/* Toggle role */}
                      <Button
                        variant="ghost"
                        size="sm"
                        title={user.role === "admin" ? "Rebaixar para cliente" : "Promover a admin"}
                        disabled={actionLoading === user.id}
                        onClick={() =>
                          handleAction("change_role", user.id, {
                            role: user.role === "admin" ? "client" : "admin",
                          })
                        }
                        className="text-accent hover:text-accent"
                      >
                        {user.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>

                      {/* Ban/Unban */}
                      {user.banned_at ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Desbanir"
                          disabled={actionLoading === user.id}
                          onClick={() => handleAction("unban_user", user.id)}
                          className="text-primary hover:text-primary"
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Banir"
                          disabled={actionLoading === user.id}
                          onClick={() => handleAction("ban_user", user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Deletar permanentemente"
                        disabled={actionLoading === user.id}
                        onClick={() => handleAction("delete_user", user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTab;
