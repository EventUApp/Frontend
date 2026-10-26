import {
  EventPlan,
  Service,
  Provider,
  ServiceCategory,
  AppEvent,
  ChatConversation,
  ChatMessage,
  Claim,
} from '../types';
import {
  mockPlans,
  mockServices,
  mockProviders,
  mockCategories,
  mockInitialEvents,
  mockConversations,
  mockMessages,
  mockClaims,
} from '../mocks';

/**
 * Capa de Servicios Abstracta (Mock Ready)
 * Preparada para recibir integración con REST API / GraphQL / Supabase en fases posteriores.
 */

export const eventsService = {
  async getPlans(): Promise<EventPlan[]> {
    return Promise.resolve(mockPlans);
  },

  async getPlanById(id: string): Promise<EventPlan | undefined> {
    return Promise.resolve(mockPlans.find((p) => p.id === id));
  },

  async getEvents(): Promise<AppEvent[]> {
    return Promise.resolve(mockInitialEvents);
  },

  async getEventById(id: string): Promise<AppEvent | undefined> {
    return Promise.resolve(mockInitialEvents.find((e) => e.id === id));
  },
};

export const marketplaceService = {
  async getCategories(): Promise<ServiceCategory[]> {
    return Promise.resolve(mockCategories);
  },

  async getServices(categoryId?: string): Promise<Service[]> {
    if (!categoryId) return Promise.resolve(mockServices);
    return Promise.resolve(mockServices.filter((s) => s.category === categoryId));
  },

  async getServiceById(id: string): Promise<Service | undefined> {
    return Promise.resolve(mockServices.find((s) => s.id === id));
  },

  async getProviders(): Promise<Provider[]> {
    return Promise.resolve(mockProviders);
  },

  async getProviderById(id: string): Promise<Provider | undefined> {
    return Promise.resolve(mockProviders.find((p) => p.id === id));
  },
};

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    return Promise.resolve(mockConversations);
  },

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return Promise.resolve(mockMessages[chatId] || []);
  },
};

export const claimsService = {
  async getClaims(): Promise<Claim[]> {
    return Promise.resolve(mockClaims);
  },

  async getClaimById(id: string): Promise<Claim | undefined> {
    return Promise.resolve(mockClaims.find((c) => c.id === id));
  },
};

export const paymentsService = {
  async processMockPayment(
    eventId: string,
    amount: number,
    method: 'card' | 'pse' | 'transfer'
  ): Promise<{ success: boolean; transactionId: string; amount: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
          amount,
        });
      }, 800);
    });
  },
};
