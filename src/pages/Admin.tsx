import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, BarChart3, Settings } from "lucide-react";
import { useTrendProducts } from "@/hooks/useTrendProducts";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminStatsTab from "@/components/admin/AdminStatsTab";
import AdminSystemTab from "@/components/admin/AdminSystemTab";

const tabs = [
  { id: "products", label: "Produtos", icon: Package },
  { id: "users", label: "Usuários", icon: Users },
  { id: "stats", label: "Estatísticas", icon: BarChart3 },
  { id: "system", label: "Sistema", icon: Settings },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { data: products } = useTrendProducts();

  const hotCount = (products || []).filter((p) => p.trend_level === "hot").length;
  const risingCount = (products || []).filter((p) => p.trend_level === "rising").length;
  const avgScore = products && products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.trend_score || 0), 0) / products.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Produtos", value: (products || []).length, color: "text-primary" },
            { label: "Em Alta (Hot)", value: hotCount, color: "text-destructive" },
            { label: "Crescendo", value: risingCount, color: "text-accent" },
            { label: "Score Médio", value: avgScore, color: "text-secondary" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "products" && <AdminProductsTab />}
        {activeTab === "users" && <AdminUsersTab />}
        {activeTab === "stats" && <AdminStatsTab />}
        {activeTab === "system" && <AdminSystemTab />}
      </div>
    </div>
  );
};

export default Admin;
