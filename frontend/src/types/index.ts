export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'ACCOUNTANT' | 'STAFF' | 'VIEWER';
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  gstNumber?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  supportEmail?: string;
  contactPersonName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  unitPrice: number;
  taxRate?: number;
  quantity: number;
  hsnOrSacCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  hsnOrSacCode?: string;
  amount: number;
  inventoryItem?: InventoryItem;
}

export interface SalesOrder {
  id: string;
  orderNumber: number;
  tenantId: string;
  customerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
  terms?: string;
  placeOfSupply?: string;
  subTotal: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  items: SalesOrderItem[];
  customer?: Customer;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  inventoryItem?: InventoryItem;
}

export interface Invoice {
  id: string;
  invoiceNumber: number;
  tenantId: string;
  customerId: string;
  salesOrderId?: string;
  issueDate: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  customer?: Customer;
  salesOrder?: SalesOrder;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
}