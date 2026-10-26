export type UserRole = 'client' | 'provider' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  location?: string;
}

export interface EventType {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  popular?: boolean;
}

export type ServiceCategoryId =
  | 'salones'
  | 'decoracion'
  | 'fotografia'
  | 'video'
  | 'catering'
  | 'pasteleria'
  | 'musica'
  | 'dj'
  | 'sonido'
  | 'iluminacion'
  | 'organizadores'
  | 'animadores'
  | 'vestuario'
  | 'maquillaje'
  | 'transporte'
  | 'mobiliario'
  | 'mesas-sillas'
  | 'invitaciones'
  | 'recuerdos'
  | 'flores'
  | 'seguridad'
  | 'logistica'
  | 'otros';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  icon: string;
  count?: number;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  name: string;
  category: ServiceCategoryId;
  categoryName: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit: string; // e.g., 'por evento', 'por hora', 'por persona'
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  notIncludes: string[];
  location: string;
  available: boolean;
  recommended?: boolean;
  duration?: string;
  capacity?: string;
  conditions?: string;
  images: string[];
  updatedAt?: string;
}

export interface ProviderReview {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  date: string;
  comment: string;
  eventName: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  location: string;
  experienceYears: number;
  servicesCount: number;
  verified: boolean;
  phone: string;
  email: string;
  gallery: string[];
  reviews: ProviderReview[];
}

export interface EventPlanItem {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategoryId;
  categoryName: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  priceUnit: string;
  includesSummary: string;
}

export interface EventPlan {
  id: string;
  name: string;
  eventTypeId: string;
  eventTypeName: string;
  image: string;
  description: string;
  estimatedPrice: number;
  servicesCount: number;
  guestCount: number;
  rating: number;
  popular?: boolean;
  recent?: boolean;
  services: EventPlanItem[];
}

export type EventStatus =
  | 'draft'
  | 'quoted'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface EventTimelineItem {
  id: string;
  daysBefore: number;
  dayLabel: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface AppEvent {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  status: EventStatus;
  services: EventPlanItem[];
  quotedPrice: number;
  contractedPrice?: number;
  depositPaid: number;
  balanceDue: number;
  createdAt: string;
  quoteGeneratedAt?: string;
  timeline: EventTimelineItem[];
  coverImage?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: 'client' | 'provider';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachmentUrl?: string;
}

export interface ChatConversation {
  id: string;
  eventId: string;
  eventName: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type ClaimStatus =
  | 'open'
  | 'in_review'
  | 'awaiting_provider'
  | 'awaiting_client'
  | 'resolved'
  | 'rejected';

export interface ClaimResponse {
  id: string;
  senderId: string;
  senderRole: 'client' | 'provider' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Claim {
  id: string;
  eventId: string;
  eventName: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  clientId: string;
  clientName: string;
  reason: string;
  description: string;
  status: ClaimStatus;
  evidenceUrls: string[];
  createdAt: string;
  responses: ClaimResponse[];
}

export interface ProviderRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  eventId: string;
  eventName: string;
  serviceId: string;
  serviceName: string;
  eventDate: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed';
  notes?: string;
}
