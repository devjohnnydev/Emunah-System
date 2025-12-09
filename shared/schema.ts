import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, numeric, json, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").default("SELLER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
  category: text("category"),
  status: text("status").default("Ativo"),
  rating: integer("rating").default(5),
  productionTimeDays: integer("production_time_days").default(7),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  category: text("category"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  colors: json("colors").$type<string[]>(),
  sizes: json("sizes").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prints = pgTable("prints", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  technique: text("technique"),
  colors: text("colors"),
  imageUrl: text("image_url"),
  imageType: text("image_type").default("url"),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  leadName: text("lead_name"),
  leadContact: text("lead_contact"),
  itemsSummary: text("items_summary"),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("Rascunho"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  quoteId: integer("quote_id").references(() => quotes.id),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  itemsSummary: text("items_summary"),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }).notNull(),
  deliveryDate: date("delivery_date"),
  stage: text("stage").default("Aguardando"),
  progress: integer("progress").default(0),
  priority: text("priority").default("Normal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionNumber: text("transaction_number").notNull().unique(),
  orderId: integer("order_id").references(() => orders.id),
  description: text("description").notNull(),
  category: text("category"),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("Pendente"),
  transactionDate: date("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertPrintSchema = createInsertSchema(prints).omit({ id: true, createdAt: true });
export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Print = typeof prints.$inferSelect;
export type InsertPrint = z.infer<typeof insertPrintSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
