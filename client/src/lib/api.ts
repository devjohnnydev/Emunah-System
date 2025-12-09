const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro de rede' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  pendingQuotes: number;
  ordersInProduction: number;
  totalClients: number;
}

export const getDashboardStats = () => fetchApi<DashboardStats>('/dashboard/stats');

// Clients
export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

export const getClients = () => fetchApi<Client[]>('/clients');
export const createClient = (data: Omit<Client, 'id'>) => 
  fetchApi<{id: number}>('/clients', { method: 'POST', body: JSON.stringify(data) });

// Suppliers
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  rating: number;
}

export const getSuppliers = () => fetchApi<Supplier[]>('/suppliers');
export const createSupplier = (data: Omit<Supplier, 'id'>) => 
  fetchApi<{id: number}>('/suppliers', { method: 'POST', body: JSON.stringify(data) });

// Products
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  colors: string[];
  sizes: string[];
}

export const getProducts = () => fetchApi<Product[]>('/products');
export const createProduct = (data: Omit<Product, 'id'>) => 
  fetchApi<{id: number}>('/products', { method: 'POST', body: JSON.stringify(data) });

// Prints
export interface PrintItem {
  id: number;
  name: string;
  technique: string;
  colors: string;
  imageUrl: string;
  imageType: string;
  tags: string[];
}

export const getPrints = () => fetchApi<PrintItem[]>('/prints');
export const createPrint = (data: Omit<PrintItem, 'id'>) => 
  fetchApi<{id: number}>('/prints', { method: 'POST', body: JSON.stringify(data) });
export const uploadPrintFile = async (file: File): Promise<{url: string}> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/prints/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Erro no upload');
  return response.json();
};

// Quotes
export interface Quote {
  id: number;
  quoteNumber: string;
  clientId: number | null;
  clientName: string;
  contact: string;
  itemsSummary: string;
  totalValue: number;
  status: string;
  date: string;
}

export const getQuotes = () => fetchApi<Quote[]>('/quotes');
export const createQuote = (data: {
  clientId?: number;
  leadName?: string;
  leadContact?: string;
  itemsSummary: string;
  totalValue: number;
  status?: string;
}) => fetchApi<{id: number; quoteNumber: string}>('/quotes', { method: 'POST', body: JSON.stringify(data) });

// Orders
export interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  itemsSummary: string;
  totalValue: number;
  deliveryDate: string | null;
  stage: string;
  progress: number;
  priority: string;
}

export const getOrders = () => fetchApi<Order[]>('/orders');
export const createOrder = (data: {
  quoteId?: number;
  clientId: number;
  itemsSummary: string;
  totalValue: number;
  deliveryDate?: string;
  stage?: string;
  priority?: string;
}) => fetchApi<{id: number; orderNumber: string}>('/orders', { method: 'POST', body: JSON.stringify(data) });

// Transactions
export interface Transaction {
  id: number;
  transactionNumber: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  status: string;
  date: string;
}

export const getTransactions = () => fetchApi<Transaction[]>('/transactions');
export const createTransaction = (data: {
  orderId?: number;
  description: string;
  category?: string;
  type: 'income' | 'expense';
  amount: number;
  status?: string;
  date?: string;
}) => fetchApi<{id: number; transactionNumber: string}>('/transactions', { method: 'POST', body: JSON.stringify(data) });
