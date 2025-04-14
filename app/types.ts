export interface Property {
  propertyId: string;
  title?: string;
  nameOfTheProperty?: string;
  micromarket?: string;
  assetType?: string;
  unitType?: string;
  facing?: string;
  totalAskPrice?: number;
  askPricePerSqft?: number;
  sbua?: number;
  plotSize?: number;
  carpet?: number;
  floorNo?: string;
  handoverDate?: string;
  buildingKhata?: string;
  landKhata?: string;
  buildingAge?: string;
  tenanted?: boolean;
  area?: string;
  dateOfInventoryAdded?: number;
  extraDetails?: string;
  driveLink?: string;
  photo?: string[];
  video?: string[];
  mapLocation?: string;
  cpId?: string;
  cpCode?: string;
  description?: string;
  status?: string;
  objectID?: string;
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