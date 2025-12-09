import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { Search, Plus, Package, Ruler, Palette as PaletteIcon, MoreHorizontal, Loader2 } from "lucide-react";

export default function Products() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: getProducts
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-products-title">Produtos</h1>
          <p className="text-muted-foreground">Catálogo de itens base para personalização.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-new-product">
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="space-y-4">
          <Card className="border-border/50 shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <div className="flex flex-col gap-1">
                  {["Todos", "Camisetas", "Baby Look", "Inverno", "Infantil", "Acessórios"].map((cat) => (
                    <Button 
                      key={cat} 
                      variant="ghost" 
                      className="justify-start h-8 px-2 font-normal hover:bg-secondary/50"
                      data-testid={`filter-category-${cat.toLowerCase()}`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estoque</label>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" className="justify-start h-8 px-2 font-normal hover:bg-secondary/50">Em Estoque</Button>
                  <Button variant="ghost" className="justify-start h-8 px-2 font-normal hover:bg-secondary/50">Baixo Estoque</Button>
                  <Button variant="ghost" className="justify-start h-8 px-2 font-normal hover:bg-secondary/50">Sem Estoque</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome ou SKU..."
                className="pl-9 h-9"
                data-testid="input-search-products"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products && products.map((product) => (
                <Card key={product.id} className="border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden" data-testid={`card-product-${product.id}`}>
                  <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium font-serif">{product.name}</CardTitle>
                        <CardDescription className="text-xs font-mono mt-1">{product.sku}</CardDescription>
                      </div>
                      <Badge variant="outline" className="font-normal">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</span>
                      <span className="text-xs text-muted-foreground">Custo: {formatCurrency(product.cost)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <PaletteIcon className="h-3 w-3" />
                        <div className="flex gap-1 flex-wrap">
                          {product.colors && product.colors.map(color => (
                            <span key={color} className="px-1.5 py-0.5 bg-secondary/50 rounded-sm">{color}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Ruler className="h-3 w-3" />
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes && product.sizes.map(size => (
                            <span key={size} className="px-1.5 py-0.5 bg-secondary/50 rounded-sm">{size}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                      <span className={`text-xs font-medium ${product.stock < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {product.stock} unidades
                      </span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" data-testid={`button-edit-${product.id}`}>Editar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {products && products.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
