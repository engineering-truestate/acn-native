export interface Property {
  id?: string;
  propertyId?: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  totalAskPrice?: number;
  unitType?: string;
  sbua?: number;
  micromarket?: string;
  currentStatus?: string;
  assetType?: string;
  facing?: string;
  floorNo?: string;
  plotSize?: number;
  carpet?: number;
  askPricePerSqft?: number;
  area?: string;
  cpCode?: string;
  driveLink?: string;
  [key: string]: any; // for additional dynamic fields
} 