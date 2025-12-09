import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, getDashboardStats } from "@/lib/api";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Calendar, Download, Loader2 } from "lucide-react";

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
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: getTransactions
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: getDashboardStats
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalIncome = transactions?.filter(t => t.type === 'income' && t.status === 'Confirmado').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'expense' && t.status === 'Confirmado').reduce((sum, t) => sum + t.amount, 0) || 0;
  const balance = totalIncome - totalExpense;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-finance-title">Financeiro</h1>
          <p className="text-muted-foreground">Fluxo de caixa e controle de despesas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-period">
            <Calendar className="mr-2 h-4 w-4" /> Dezembro 2024
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm bg-primary text-primary-foreground" data-testid="card-balance">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-3xl font-bold font-serif" data-testid="text-balance">{formatCurrency(balance)}</div>
                <p className="text-xs opacity-70 mt-1">
                  Disponível para operação
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm" data-testid="card-income">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entradas (Mês)</CardTitle>
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground" data-testid="text-income">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center">
                  Receitas confirmadas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm" data-testid="card-expense">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saídas (Mês)</CardTitle>
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground" data-testid="text-expense">{formatCurrency(totalExpense)}</div>
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  Despesas confirmadas
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
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

        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Transações Recentes</CardTitle>
            <CardDescription>Últimas movimentações</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {transactions && transactions.slice(0, 5).map((trx) => (
                  <div key={trx.id} className="flex items-center justify-between" data-testid={`row-transaction-${trx.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                        {trx.type === 'income' ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none truncate max-w-[140px]">{trx.description}</p>
                        <p className="text-xs text-muted-foreground">{trx.date} • {trx.category}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${trx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                    </div>
                  </div>
                ))}
                {transactions && transactions.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Nenhuma transação encontrada</p>
                )}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-4 text-xs" data-testid="button-view-all">
              Ver Extrato Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
