
export enum UserRole {
  TENANT = 'TENANT',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export enum EnquiryStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  CLOSED = 'Closed',
  RENTED = 'Rented',
}

export enum PropertyStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PropertyAvailability {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  status?: 'ACTIVE' | 'BLOCKED'; 
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  location: string;
  rent: number;
  size: number;
  bedrooms: number;
  images: string[];
  status: PropertyStatus;
  availability: PropertyAvailability;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}
