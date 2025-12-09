import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", total: 12000 },
  { name: "Fev", total: 18000 },
  { name: "Mar", total: 15000 },
  { name: "Abr", total: 24000 },
  { name: "Mai", total: 28000 },
  { name: "Jun", total: 32000 },
  { name: "Jul", total: 29000 },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão EMUNAH.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 20.1%
              </span> 
              vs mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Cotações Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              4 precisam de atenção urgente
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Pedidos em Produção
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-amber-600 font-medium">3 em fase de estampa</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Novos Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">+573</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12%
              </span> 
              vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
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
                <AreaChart data={data}>
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

        {/* Recent Activity */}
        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atualizações do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  title: "Pedido #1024 Aprovado",
                  desc: "Igreja Batista Central aprovou o orçamento.",
                  time: "2h atrás",
                  icon: CheckCircle2,
                  color: "text-emerald-600"
                },
                {
                  title: "Nova Cotação Solicitada",
                  desc: "Grupo de Jovens Restauração solicitou orçamento.",
                  time: "4h atrás",
                  icon: AlertCircle,
                  color: "text-amber-600"
                },
                {
                  title: "Produção Iniciada",
                  desc: "Pedido #1021 entrou em fase de corte.",
                  time: "5h atrás",
                  icon: Activity,
                  color: "text-blue-600"
                },
                {
                  title: "Pagamento Recebido",
                  desc: "Confirmação de pagamento do Pedido #1020.",
                  time: "1d atrás",
                  icon: DollarSign,
                  color: "text-emerald-600"
                },
                {
                  title: "Estoque Baixo",
                  desc: "Camiseta Algodão M Branca abaixo do mínimo.",
                  time: "1d atrás",
                  icon: AlertCircle,
                  color: "text-destructive"
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 p-1.5 rounded-full bg-background border border-border ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
