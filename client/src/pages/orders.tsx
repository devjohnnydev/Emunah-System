import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Clock, CheckCircle2, Scissors, Palette, Package } from "lucide-react";

const orders = [
  {
    id: "PED-1024",
    client: "Igreja Batista Central",
    items: "50x Camisetas Algodão",
    deliveryDate: "20/12/2024",
    progress: 25,
    stage: "Corte",
    stageIcon: Scissors,
    stageColor: "text-blue-500",
    priority: "Normal"
  },
  {
    id: "PED-1023",
    client: "Coral Vozes de Sião",
    items: "20x Túnicas",
    deliveryDate: "15/12/2024",
    progress: 75,
    stage: "Costura",
    stageIcon: Palette,
    stageColor: "text-amber-500",
    priority: "Alta"
  },
  {
    id: "PED-1022",
    client: "Retiro de Casais",
    items: "30x Camisetas Polo",
    deliveryDate: "12/12/2024",
    progress: 90,
    stage: "Acabamento",
    stageIcon: CheckCircle2,
    stageColor: "text-purple-500",
    priority: "Urgente"
  },
  {
    id: "PED-1021",
    client: "Grupo de Louvor",
    items: "15x Camisetas DryFit",
    deliveryDate: "22/12/2024",
    progress: 10,
    stage: "Aguardando",
    stageIcon: Clock,
    stageColor: "text-slate-500",
    priority: "Normal"
  },
];

export default function Orders() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe a produção e entrega.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pedido..."
                className="pl-9 h-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stages Columns (Kanban-like simplified for now) */}
        {["Aguardando", "Produção", "Acabamento", "Concluído"].map((col) => (
            <div key={col} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif font-medium text-lg">{col}</h3>
                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                        {Math.floor(Math.random() * 5)}
                    </Badge>
                </div>
                
                {/* Placeholder Cards for visuals */}
                {orders.filter(o => {
                    if (col === "Aguardando" && o.progress < 20) return true;
                    if (col === "Produção" && o.progress >= 20 && o.progress < 80) return true;
                    if (col === "Acabamento" && o.progress >= 80 && o.progress < 100) return true;
                    if (col === "Concluído" && o.progress === 100) return true;
                    return false;
                }).map(order => (
                    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-all border-border/60">
                        <CardHeader className="p-4 pb-2 space-y-0">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                                    {order.id}
                                </Badge>
                                {order.priority === "Urgente" && (
                                    <Badge className="bg-destructive text-destructive-foreground text-[10px]">Urgente</Badge>
                                )}
                            </div>
                            <CardTitle className="text-base font-medium pt-2 leading-tight">
                                {order.client}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <p className="text-sm text-muted-foreground mb-3">{order.items}</p>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <order.stageIcon className={`h-3 w-3 ${order.stageColor}`} />
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
                ))}
            </div>
        ))}
      </div>
    </Layout>
  );
}
