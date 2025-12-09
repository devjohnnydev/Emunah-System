import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getOrders, getTransactions } from "@/lib/api";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { name: "Jan", total: 12000 },
  { name: "Fev", total: 18000 },
  { name: "Mar", total: 15000 },
  { name: "Abr", total: 24000 },
  { name: "Mai", total: 28000 },
  { name: "Jun", total: 32000 },
  { name: "Jul", total: 29000 },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: getDashboardStats
  });

  const { data: orders } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: getOrders
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: getTransactions
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão EMUNAH.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group" data-testid="card-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold font-serif text-foreground" data-testid="text-total-revenue">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-emerald-600 flex items-center font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 20.1%
                  </span> 
                  vs mês anterior
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group" data-testid="card-quotes">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Cotações Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold font-serif text-foreground" data-testid="text-pending-quotes">
                  {stats?.pendingQuotes || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Aguardando resposta
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group" data-testid="card-orders">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Pedidos em Produção
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold font-serif text-foreground" data-testid="text-orders-production">
                  {stats?.ordersInProduction || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-amber-600 font-medium">Em diferentes etapas</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group" data-testid="card-clients">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold font-serif text-foreground" data-testid="text-total-clients">
                  {stats?.totalClients || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-emerald-600 flex items-center font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> Ativos
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Visão Geral de Vendas</CardTitle>
            <CardDescription>
              Faturamento dos últimos 7 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$${value}`} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value) => [`R$ ${value}`, "Total"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atualizações do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {orders && orders.slice(0, 3).map((order, i) => (
                <div key={order.id} className="flex items-start gap-4">
                  <div className="mt-1 p-1.5 rounded-full bg-background border border-border text-blue-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">Pedido {order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.clientName} - {order.stage}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{order.progress}%</div>
                </div>
              ))}
              {transactions && transactions.slice(0, 2).map((trx, i) => (
                <div key={trx.id} className="flex items-start gap-4">
                  <div className={`mt-1 p-1.5 rounded-full bg-background border border-border ${trx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{trx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {trx.category} - {trx.status}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{trx.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
