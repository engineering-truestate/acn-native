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

export interface Budget{
  from?: number;
  to?: number;
}

export interface Requirement {
  id?: string;
  added?: number;
  agentCpid?: string;
  area?: number;
  assetType?: string;
  budget: Budget;
  configuration?: string;
  lastModified?: number;
  marketValue?: string;
  propertyName?: string, 
  requirementDetails?: string;
  requirementId?: string;
  [key: string]: any;
}