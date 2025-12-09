import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Users,
  Truck,
  Package,
  Palette,
  Wallet,
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import logoImage from "@assets/generated_images/abstract_leaf_logo_symbol_for_emunah_brand.png";

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cotações", href: "/quotes", icon: FileText },
    { name: "Pedidos", href: "/orders", icon: ShoppingBag },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Fornecedores", href: "/suppliers", icon: Truck },
    { name: "Produtos", href: "/products", icon: Package },
    { name: "Estampas", href: "/prints", icon: Palette },
    { name: "Financeiro", href: "/finance", icon: Wallet },
  ];

  return (
    <div className={cn("pb-12 h-full bg-sidebar text-sidebar-foreground", className)}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-2 flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-md">
            <img src={logoImage} alt="Emunah Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-white">
            EMUNAH
          </h2>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-sans text-base transition-all duration-200",
                    location === item.href 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm" 
                      : "text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <div className="bg-sidebar-accent/50 rounded-lg p-4 backdrop-blur-sm border border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 mb-1">Logado como</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-sidebar-ring">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Administrador</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@emunah.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <div className="min-h-screen bg-background font-sans flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 fixed inset-y-0 z-50 border-r border-sidebar-border shadow-xl">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Content */}
        <SheetContent side="left" className="p-0 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <Sidebar />
        </SheetContent>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 transition-all">
            <div className="flex items-center gap-4">
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <div className="hidden md:flex items-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Sistema de Vendas</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="font-medium text-foreground">Visão Geral</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cotações, pedidos..."
                  className="pl-9 h-9 bg-background border-border hover:border-primary/50 focus:border-primary transition-colors rounded-full"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-background" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src="/placeholder-user.jpg" alt="@admin" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Administrador</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@emunah.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 md:p-8 overflow-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Sheet>
  );
}
