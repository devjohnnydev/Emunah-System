import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MoreHorizontal, FileText, Search, Filter } from "lucide-react";

const quotes = [
  {
    id: "COT-2024-001",
    client: "Igreja Batista Central",
    contact: "Pastor João",
    date: "09/12/2024",
    items: "50x Camisetas Algodão",
    value: "R$ 2.450,00",
    status: "Aprovada",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  },
  {
    id: "COT-2024-002",
    client: "Grupo Jovens Luz",
    contact: "Ana Maria",
    date: "08/12/2024",
    items: "30x Camisetas DryFit",
    value: "R$ 1.200,00",
    status: "Pendente",
    statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
  },
  {
    id: "COT-2024-003",
    client: "Congresso de Mulheres",
    contact: "Pra. Helena",
    date: "08/12/2024",
    items: "100x Baby Look",
    value: "R$ 3.800,00",
    status: "Rascunho",
    statusColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
  },
  {
    id: "COT-2024-004",
    client: "Retiro Espiritual 2025",
    contact: "Carlos Eduardo",
    date: "07/12/2024",
    items: "80x Camisetas Algodão",
    value: "R$ 3.120,00",
    status: "Enviada",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    id: "COT-2024-005",
    client: "Ministério Infantil",
    contact: "Tia Sueli",
    date: "05/12/2024",
    items: "40x Camisetas Infantis",
    value: "R$ 1.500,00",
    status: "Rejeitada",
    statusColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  },
];

export default function Quotes() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Cotações</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e propostas comerciais.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Nova Cotação
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="approved">Aprovadas</TabsTrigger>
                <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente ou cotação..."
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Resumo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-xs">{quote.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{quote.client}</span>
                      <span className="text-xs text-muted-foreground">{quote.contact}</span>
                    </div>
                  </TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{quote.items}</TableCell>
                  <TableCell className="font-medium">{quote.value}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`font-normal ${quote.statusColor}`}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
