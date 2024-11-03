export type UserRole = 'admin' | 'compras' | 'pcp' | 'pd' | 'garantia' | 'regulatorios' | 'comercial';

export interface User {
  id: string;
  uid: string;
  username: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  classification: string;
  pi: string;
  pa: string;
  structure: string;
  specification: string;
  packaging: string;
  lid: string;
  pot: string;
  label: string;
  supplier: string;
  qualification: string;
  observations: string;
  others: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  products: string;
  paymentTerms: string;
  deliveryTerms: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'requested' | 'approved' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ProductionOrder {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: 'planned' | 'inProgress' | 'delayed' | 'completed';
  instructions: string;
  attachments: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface RDProject {
  id: string;
  name: string;
  description: string;
  targetProduct: string;
  budget: number;
  responsibles: string[];
  status: 'research' | 'development' | 'testing' | 'completed';
  progress: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  documents: Document[];
  updates: ProjectUpdate[];
  metrics: ProjectMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectUpdate {
  id: string;
  content: string;
  responsible: string;
  date: string;
}

export interface ProjectMetrics {
  costToDate: number;
  developmentTime: number;
  testsCompleted: number;
  testsSuccessful: number;
}

export interface WarrantyClaim {
  id: string;
  productId: string;
  customer: string;
  claimDate: string;
  description: string;
  status: 'open' | 'analyzing' | 'resolved' | 'closed';
  history: WarrantyHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyHistory {
  id: string;
  action: string;
  details: string;
  replacement?: string;
  repair?: string;
  responsible: string;
  date: string;
}

export interface RegulatoryDocument {
  id: string;
  name: string;
  number: string;
  issueDate: string;
  validityDate: string;
  productId: string;
  status: 'pending' | 'updated' | 'expired';
  documentUrl?: string;
  documentType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  address: string;
  status: 'potential' | 'active' | 'inactive';
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesOpportunity {
  id: string;
  customerId: string;
  productId: string;
  estimatedValue: number;
  closeProbability: number;
  startDate: string;
  expectedCloseDate: string;
  status: 'negotiation' | 'proposalSent' | 'analysis' | 'closed' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  finalValue: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}