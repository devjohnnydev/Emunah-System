import { db } from "./db";
import { clients, suppliers, products, prints, quotes, orders, transactions } from "@shared/schema";
import type { Client, Supplier, Product, Print, Quote, Order, Transaction } from "@shared/schema";

export interface IStorage {
  getClients(): Promise<Client[]>;
  getSuppliers(): Promise<Supplier[]>;
  getProducts(): Promise<Product[]>;
  getPrints(): Promise<Print[]>;
  getQuotes(): Promise<Quote[]>;
  getOrders(): Promise<Order[]>;
  getTransactions(): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  async getClients(): Promise<Client[]> {
    return db.select().from(clients);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers);
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getPrints(): Promise<Print[]> {
    return db.select().from(prints);
  }

  async getQuotes(): Promise<Quote[]> {
    return db.select().from(quotes);
  }

  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async getTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions);
  }
}

export const storage = new DatabaseStorage();
