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