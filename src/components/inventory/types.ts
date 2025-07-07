
export interface PriceData {
  id: string;
  category: string;
  subcategory?: string;
  wattage?: number;
  pricePerUnit: number;
  notes?: string;
}

export interface NewItemForm {
  category: string;
  subcategory: string;
  wattage: string;
  pricePerUnit: string;
  notes: string;
}
