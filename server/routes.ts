import type { Express } from "express";
import type { Server } from "http";
import { db } from "./db";
import { clients, suppliers, products, prints, quotes, orders, transactions } from "@shared/schema";
import { eq, sql, and, inArray } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/clients", async (_req, res) => {
    try {
      const result = await db.select().from(clients);
      res.json(result);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const [client] = await db.insert(clients).values(req.body).returning();
      res.status(201).json({ id: client.id, message: "Cliente criado com sucesso" });
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.get("/api/suppliers", async (_req, res) => {
    try {
      const result = await db.select().from(suppliers);
      res.json(result);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const [supplier] = await db.insert(suppliers).values(req.body).returning();
      res.status(201).json({ id: supplier.id, message: "Fornecedor criado com sucesso" });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({ error: "Failed to create supplier" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const result = await db.select().from(products);
      res.json(result.map(p => ({
        ...p,
        price: parseFloat(p.price),
        cost: parseFloat(p.cost)
      })));
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const [product] = await db.insert(products).values(req.body).returning();
      res.status(201).json({ id: product.id, message: "Produto criado com sucesso" });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.get("/api/prints", async (_req, res) => {
    try {
      const result = await db.select().from(prints);
      res.json(result.map(p => ({
        id: p.id,
        name: p.name,
        technique: p.technique,
        colors: p.colors,
        imageUrl: p.imageUrl,
        imageType: p.imageType,
        tags: p.tags
      })));
    } catch (error) {
      console.error("Error fetching prints:", error);
      res.status(500).json({ error: "Failed to fetch prints" });
    }
  });

  app.post("/api/prints", async (req, res) => {
    try {
      const [print] = await db.insert(prints).values(req.body).returning();
      res.status(201).json({ id: print.id, message: "Estampa criada com sucesso" });
    } catch (error) {
      console.error("Error creating print:", error);
      res.status(500).json({ error: "Failed to create print" });
    }
  });

  app.post("/api/prints/upload", async (req, res) => {
    try {
      const timestamp = Date.now();
      const placeholderUrl = `/uploads/print_${timestamp}.png`;
      res.json({ url: placeholderUrl });
    } catch (error) {
      console.error("Error uploading print:", error);
      res.status(500).json({ error: "Failed to upload print" });
    }
  });

  app.get("/api/quotes", async (_req, res) => {
    try {
      const result = await db.select().from(quotes);
      const clientsData = await db.select().from(clients);
      const clientMap = new Map(clientsData.map(c => [c.id, c]));
      
      res.json(result.map(q => {
        const client = q.clientId ? clientMap.get(q.clientId) : null;
        return {
          id: q.id,
          quoteNumber: q.quoteNumber,
          clientId: q.clientId,
          clientName: client?.name || q.leadName,
          contact: client?.contact || q.leadContact,
          itemsSummary: q.itemsSummary,
          totalValue: parseFloat(q.totalValue),
          status: q.status,
          date: q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : ''
        };
      }));
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const lastQuote = await db.select().from(quotes).orderBy(sql`id desc`).limit(1);
      const quoteNum = `COT-2024-${String((lastQuote[0]?.id || 0) + 1).padStart(3, '0')}`;
      
      const [quote] = await db.insert(quotes).values({
        ...req.body,
        quoteNumber: quoteNum
      }).returning();
      res.status(201).json({ id: quote.id, quoteNumber: quoteNum, message: "Cotação criada com sucesso" });
    } catch (error) {
      console.error("Error creating quote:", error);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const result = await db.select().from(orders);
      const clientsData = await db.select().from(clients);
      const clientMap = new Map(clientsData.map(c => [c.id, c]));
      
      res.json(result.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        clientName: clientMap.get(o.clientId)?.name || '',
        itemsSummary: o.itemsSummary,
        totalValue: parseFloat(o.totalValue),
        deliveryDate: o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString('pt-BR') : null,
        stage: o.stage,
        progress: o.progress,
        priority: o.priority
      })));
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const lastOrder = await db.select().from(orders).orderBy(sql`id desc`).limit(1);
      const orderNum = `PED-${1024 + (lastOrder[0]?.id || 0)}`;
      
      const [order] = await db.insert(orders).values({
        ...req.body,
        orderNumber: orderNum
      }).returning();
      res.status(201).json({ id: order.id, orderNumber: orderNum, message: "Pedido criado com sucesso" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/transactions", async (_req, res) => {
    try {
      const result = await db.select().from(transactions).orderBy(sql`transaction_date desc`);
      res.json(result.map(t => ({
        id: t.id,
        transactionNumber: t.transactionNumber,
        description: t.description,
        category: t.category,
        type: t.type,
        amount: parseFloat(t.amount),
        status: t.status,
        date: t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('pt-BR') : ''
      })));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const lastTrx = await db.select().from(transactions).orderBy(sql`id desc`).limit(1);
      const trxNum = `TRX-${9800 + (lastTrx[0]?.id || 0)}`;
      
      const [transaction] = await db.insert(transactions).values({
        ...req.body,
        transactionNumber: trxNum
      }).returning();
      res.status(201).json({ id: transaction.id, transactionNumber: trxNum, message: "Transação criada com sucesso" });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const [revenueResult] = await db.select({
        total: sql<string>`COALESCE(SUM(CASE WHEN type = 'income' AND status = 'Confirmado' THEN amount ELSE 0 END), 0)`
      }).from(transactions);
      
      const [quotesCount] = await db.select({
        count: sql<number>`COUNT(*)`
      }).from(quotes).where(eq(quotes.status, 'Pendente'));
      
      const [ordersCount] = await db.select({
        count: sql<number>`COUNT(*)`
      }).from(orders).where(inArray(orders.stage, ['Corte', 'Estampa', 'Costura', 'Acabamento']));
      
      const [clientsCount] = await db.select({
        count: sql<number>`COUNT(*)`
      }).from(clients);
      
      res.json({
        totalRevenue: parseFloat(revenueResult?.total || '0'),
        pendingQuotes: Number(quotesCount?.count || 0),
        ordersInProduction: Number(ordersCount?.count || 0),
        totalClients: Number(clientsCount?.count || 0)
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  return httpServer;
}
