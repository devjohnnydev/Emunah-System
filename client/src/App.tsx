import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Quotes from "@/pages/quotes";
import Orders from "@/pages/orders";
import Suppliers from "@/pages/suppliers";
import Products from "@/pages/products";
import Prints from "@/pages/prints";
import Finance from "@/pages/finance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/quotes" component={Quotes} />
      <Route path="/orders" component={Orders} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/products" component={Products} />
      <Route path="/prints" component={Prints} />
      <Route path="/finance" component={Finance} />
      
      {/* Placeholder pages for routes not yet implemented but in sidebar */}
      <Route path="/clients" component={() => <div className="p-8 text-center text-muted-foreground">Página de Clientes em construção</div>} />
      
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
