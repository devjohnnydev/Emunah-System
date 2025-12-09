import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getQuotes } from "@/lib/api";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MoreHorizontal, FileText, Search, Filter, Loader2 } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aprovada':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Pendente':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Enviada':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Rejeitada':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
  }
};

export default function Quotes() {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['/api/quotes'],
    queryFn: getQuotes
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-quotes-title">Cotações</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e propostas comerciais.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-new-quote">
          <Plus className="mr-2 h-4 w-4" /> Nova Cotação
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
                <TabsTrigger value="all" data-testid="tab-all">Todas</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">Pendentes</TabsTrigger>
                <TabsTrigger value="approved" data-testid="tab-approved">Aprovadas</TabsTrigger>
                <TabsTrigger value="draft" data-testid="tab-draft">Rascunhos</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente ou cotação..."
                  className="pl-9 h-9"
                  data-testid="input-search-quotes"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                {quotes && quotes.map((quote) => (
                  <TableRow key={quote.id} className="group cursor-pointer hover:bg-muted/30" data-testid={`row-quote-${quote.id}`}>
                    <TableCell className="font-medium font-mono text-xs">{quote.quoteNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{quote.clientName}</span>
                        <span className="text-xs text-muted-foreground">{quote.contact}</span>
                      </div>
                    </TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{quote.itemsSummary}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(quote.totalValue)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-normal ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-menu-${quote.id}`}>
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
                {quotes && quotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma cotação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
