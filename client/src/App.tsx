import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Quotes from "@/pages/quotes";
import Orders from "@/pages/orders";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/quotes" component={Quotes} />
      <Route path="/orders" component={Orders} />
      {/* Placeholder pages for routes not yet implemented but in sidebar */}
      <Route path="/clients" component={() => <div className="p-8 text-center text-muted-foreground">Página de Clientes em construção</div>} />
      <Route path="/suppliers" component={() => <div className="p-8 text-center text-muted-foreground">Página de Fornecedores em construção</div>} />
      <Route path="/products" component={() => <div className="p-8 text-center text-muted-foreground">Página de Produtos em construção</div>} />
      <Route path="/prints" component={() => <div className="p-8 text-center text-muted-foreground">Página de Estampas em construção</div>} />
      <Route path="/finance" component={() => <div className="p-8 text-center text-muted-foreground">Página de Financeiro em construção</div>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
