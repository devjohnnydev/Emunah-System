import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Calendar, Download } from "lucide-react";

const transactions = [
  {
    id: "TRX-9821",
    date: "09/12/2024",
    description: "Pagamento Pedido #1024 - Igreja Batista",
    category: "Vendas",
    type: "income",
    amount: "R$ 1.225,00",
    status: "Confirmado"
  },
  {
    id: "TRX-9820",
    date: "08/12/2024",
    description: "Compra Tecidos - Têxtil Santa Maria",
    category: "Matéria Prima",
    type: "expense",
    amount: "R$ 850,00",
    status: "Confirmado"
  },
  {
    id: "TRX-9819",
    date: "08/12/2024",
    description: "Sinal Pedido #1023 - Coral Vozes",
    category: "Vendas",
    type: "income",
    amount: "R$ 600,00",
    status: "Confirmado"
  },
  {
    id: "TRX-9818",
    date: "07/12/2024",
    description: "Manutenção Máquina Estampa",
    category: "Manutenção",
    type: "expense",
    amount: "R$ 350,00",
    status: "Pendente"
  },
  {
    id: "TRX-9817",
    date: "06/12/2024",
    description: "Conta de Energia",
    category: "Despesas Fixas",
    type: "expense",
    amount: "R$ 420,50",
    status: "Agendado"
  }
];

const cashFlowData = [
  { name: "Seg", income: 2400, expense: 1200 },
  { name: "Ter", income: 1398, expense: 2100 },
  { name: "Qua", income: 9800, expense: 1800 },
  { name: "Qui", income: 3908, expense: 2800 },
  { name: "Sex", income: 4800, expense: 1900 },
  { name: "Sáb", income: 3800, expense: 2390 },
  { name: "Dom", income: 0, expense: 0 },
];

export default function Finance() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Fluxo de caixa e controle de despesas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Dezembro 2024
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">R$ 24.531,89</div>
            <p className="text-xs opacity-70 mt-1">
              Disponível para saque
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entradas (Mês)</CardTitle>
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 45.231,00</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saídas (Mês)</CardTitle>
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 12.450,00</div>
            <p className="text-xs text-red-600 mt-1 flex items-center">
              +4.1% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Fluxo de Caixa Semanal</CardTitle>
            <CardDescription>Entradas vs Saídas nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `R$${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    cursor={{fill: 'hsl(var(--secondary)/0.3)'}}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Entradas" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Saídas" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Transações Recentes</CardTitle>
            <CardDescription>Últimas 5 movimentações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                      {trx.type === 'income' ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none truncate w-[140px]">{trx.description}</p>
                      <p className="text-xs text-muted-foreground">{trx.date} • {trx.category}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${trx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trx.type === 'income' ? '+' : '-'}{trx.amount}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs">
              Ver Extrato Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
