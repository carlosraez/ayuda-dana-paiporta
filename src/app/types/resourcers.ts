// types/resources.ts

export type Priority = 'baja' | 'media' | 'alta' | 'urgente';
export type Availability = 'inmediata' | '24h' | '48h';

export interface BaseResourceData {
  id: string;
  item: string;
  details: string;
  quantity: number;
  contact: string;
  timePosted: string;
}

export interface NeedData extends BaseResourceData {
  priority: Priority;
}

export interface OfferData extends BaseResourceData {
  available: Availability;
}