import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Image as ImageIcon, Link as LinkIcon, Upload, Trash2, ExternalLink, Palette as PaletteIcon } from "lucide-react";
import { useState } from "react";

const prints = [
  {
    id: 1,
    name: "Leão de Judá - Minimalista",
    technique: "Silk Screen",
    colors: 1,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400",
    tags: ["Religioso", "Minimalista", "Animais"]
  },
  {
    id: 2,
    name: "Cruz Floral",
    technique: "DTG",
    colors: "Full Color",
    imageUrl: "https://images.unsplash.com/photo-1544967082-d9d3fdd01a1c?auto=format&fit=crop&q=80&w=400",
    tags: ["Floral", "Feminino", "Cruz"]
  },
  {
    id: 3,
    name: "Versículo Salmos 23",
    technique: "Transfer",
    colors: 2,
    imageUrl: "https://images.unsplash.com/photo-1543360885-84065275e3c8?auto=format&fit=crop&q=80&w=400",
    tags: ["Tipografia", "Bíblico"]
  },
  {
    id: 4,
    name: "Logo Juventude 2024",
    technique: "Silk Screen",
    colors: 3,
    imageUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335ca?auto=format&fit=crop&q=80&w=400",
    tags: ["Eventos", "Logo"]
  }
];

export default function Prints() {
  const [isAddingPrint, setIsAddingPrint] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Estampas</h1>
          <p className="text-muted-foreground">Biblioteca de artes e arquivos de produção.</p>
        </div>
        
        <Dialog open={isAddingPrint} onOpenChange={setIsAddingPrint}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Nova Estampa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Estampa</DialogTitle>
              <DialogDescription>
                Faça upload do arquivo ou insira uma URL externa.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Estampa</Label>
                <Input id="name" placeholder="Ex: Leão de Judá 2025" />
              </div>
              
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Local</TabsTrigger>
                  <TabsTrigger value="url">URL da Imagem</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-4 space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Clique para selecionar ou arraste o arquivo</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou AI até 10MB</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="mt-4 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="url">Link da Imagem</Label>
                    <div className="flex gap-2">
                      <Input id="url" placeholder="https://..." />
                      <Button variant="outline" size="icon">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cole o link direto da imagem (Drive, Dropbox, etc).
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="technique">Técnica</Label>
                  <Input id="technique" placeholder="Ex: Silk Screen" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="colors">Cores</Label>
                  <Input id="colors" placeholder="Ex: 4 cores / Cromia" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingPrint(false)}>Cancelar</Button>
              <Button onClick={() => setIsAddingPrint(false)}>Salvar Estampa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar estampa..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {prints.map((print) => (
          <Card key={print.id} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
            <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden">
              <img 
                src={print.imageUrl} 
                alt={print.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-serif truncate">{print.name}</CardTitle>
              <CardDescription className="text-xs">{print.technique}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-wrap gap-1 mb-3">
                {print.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary/50 rounded-sm text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2">
                <span className="flex items-center gap-1">
                  <PaletteIcon className="h-3 w-3" /> {print.colors}
                </span>
                <span>ID: {print.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
