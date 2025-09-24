export interface ProductInCycle {
  id: string;
  productId: string;
  name: string;
  unit: string;
  conversionFactor: number;
  pricePerUnit?: number;
  expiryDate?: Date;
  availableQuantity?: number;
  status: 'draft' | 'approved' | 'rejected';
  certified: boolean;
  familyFarming: boolean;
  image?: string;
  description?: string;
  lastUpdated: Date;
  updatedBy: string;
  metadados?: {
    mercado_prioritario_id?: string;
    mercado_prioritario_nome?: string;
    mercado_prioritario_tipo?: string;
    certificado?: boolean;
    agricultura_familiar?: boolean;
    outras_caracteristicas?: string;
    meses_colheita?: string[];
  };
}

export interface CycleOffer {
  cycleId: string;
  products: ProductInCycle[];
  isPublished: boolean;
}

export interface PreviousCycleData {
  cycleId: string;
  products: ProductInCycle[];
  totalProducts: number;
}