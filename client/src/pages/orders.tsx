import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api";
import { Search, Filter, Clock, CheckCircle2, Scissors, Palette, Package, Loader2 } from "lucide-react";

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'Aguardando': return Clock;
    case 'Corte': return Scissors;
    case 'Estampa': return Palette;
    case 'Costura': return Scissors;
    case 'Acabamento': return CheckCircle2;
    case 'Qualidade': return CheckCircle2;
    case 'Concluído': return Package;
    default: return Clock;
  }
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Aguardando': return 'text-slate-500';
    case 'Corte': return 'text-blue-500';
    case 'Estampa': return 'text-purple-500';
    case 'Costura': return 'text-amber-500';
    case 'Acabamento': return 'text-teal-500';
    case 'Qualidade': return 'text-green-500';
    case 'Concluído': return 'text-emerald-500';
    default: return 'text-slate-500';
  }
};

const getColumnOrders = (orders: any[], column: string) => {
  return orders.filter(o => {
    if (column === "Aguardando" && o.progress < 20) return true;
    if (column === "Produção" && o.progress >= 20 && o.progress < 80) return true;
    if (column === "Acabamento" && o.progress >= 80 && o.progress < 100) return true;
    if (column === "Concluído" && o.progress === 100) return true;
    return false;
  });
};

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: getOrders
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const columns = ["Aguardando", "Produção", "Acabamento", "Concluído"];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-orders-title">Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe a produção e entrega.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedido..."
              className="pl-9 h-9"
              data-testid="input-search-orders"
            />
          </div>
          <Button variant="outline" size="icon" data-testid="button-filter">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => {
            const columnOrders = orders ? getColumnOrders(orders, col) : [];
            return (
              <div key={col} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-medium text-lg">{col}</h3>
                  <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                    {columnOrders.length}
                  </Badge>
                </div>
                
                {columnOrders.map(order => {
                  const StageIcon = getStageIcon(order.stage);
                  return (
                    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-all border-border/60" data-testid={`card-order-${order.id}`}>
                      <CardHeader className="p-4 pb-2 space-y-0">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                            {order.orderNumber}
                          </Badge>
                          {order.priority === "Urgente" && (
                            <Badge className="bg-destructive text-destructive-foreground text-[10px]">Urgente</Badge>
                          )}
                          {order.priority === "Alta" && (
                            <Badge className="bg-amber-500 text-white text-[10px]">Alta</Badge>
                          )}
                        </div>
                        <CardTitle className="text-base font-medium pt-2 leading-tight">
                          {order.clientName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground mb-3">{order.itemsSummary}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <StageIcon className={`h-3 w-3 ${getStageColor(order.stage)}`} />
                              {order.stage}
                            </span>
                            <span>{order.deliveryDate}</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500 rounded-full" 
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {columnOrders.length === 0 && (
                  <Card className="border-dashed border-2 border-border/40">
                    <CardContent className="p-4 text-center text-muted-foreground text-sm">
                      Nenhum pedido
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
