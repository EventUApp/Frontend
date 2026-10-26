import { create } from 'zustand';
import {
  AppEvent,
  ChatConversation,
  ChatMessage,
  Claim,
  ClaimStatus,
  EventPlan,
  EventPlanItem,
  EventStatus,
  ProviderRequest,
  Service,
  User,
  UserRole,
} from '../types';
import {
  mockInitialEvents,
  mockConversations,
  mockMessages,
  mockClaims,
  mockProviderRequests,
  mockServices,
  mockPlans,
} from '../mocks';

export interface ActiveCart {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  services: EventPlanItem[];
}

interface AppState {
  // User & Role
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setUser: (user: Partial<User>) => void;

  // Active Event Cart ("Mi Evento")
  activeCart: ActiveCart;
  setCartDetails: (details: Partial<ActiveCart>) => void;
  addServiceToCart: (service: Service, quantity?: number) => void;
  removeServiceFromCart: (itemId: string) => void;
  updateServiceQuantity: (itemId: string, quantity: number) => void;
  replaceServiceInCart: (oldItemId: string, newService: Service) => void;
  clonePlanToCart: (plan: EventPlan) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTotal: () => number;

  // Events Management
  events: AppEvent[];
  createEventFromCart: () => AppEvent;
  saveCartAsQuote: () => AppEvent;
  confirmQuote: (eventId: string) => void;
  simulatePayment: (eventId: string, amount: number) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;

  // Provider Portal State
  providerServices: Service[];
  providerRequests: ProviderRequest[];
  createProviderService: (service: Omit<Service, 'id'>) => void;
  updateProviderService: (id: string, updates: Partial<Service>) => void;
  updateServicePrice: (serviceId: string, newPrice: number) => void;
  toggleServiceAvailability: (serviceId: string) => void;
  updateRequestStatus: (requestId: string, status: ProviderRequest['status']) => void;

  // Chat State
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (chatId: string, text: string, attachmentUrl?: string) => void;

  // Claims State
  claims: Claim[];
  createClaim: (claimData: {
    eventId: string;
    eventName: string;
    serviceId: string;
    serviceName: string;
    providerId: string;
    providerName: string;
    reason: string;
    description: string;
    evidenceUrls?: string[];
  }) => Claim | null;
  addClaimResponse: (claimId: string, text: string) => void;
  updateClaimStatus: (claimId: string, status: ClaimStatus) => void;
}

const initialCart: ActiveCart = {
  id: 'cart-active-1',
  name: 'Mi Primera Comunión Familiar',
  typeId: 'primera-comunion',
  typeName: 'Primera Comunión',
  date: '2026-11-20',
  location: 'Valle del Cauca',
  guestCount: 50,
  budget: 2500000,
  services: [...mockPlans[0].services], // Preloaded with default Primera Comunión items (cloned)
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: {
    id: 'usr-client-1',
    name: 'Juan Carlos Cruz',
    email: 'juancarlos@ejemplo.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: '+57 310 456 7890',
    location: 'Cali / Medellín',
  },

  switchRole: (role: UserRole) => {
    set((state) => {
      let updatedUser = { ...state.currentUser, role };
      if (role === 'provider') {
        updatedUser = {
          ...updatedUser,
          name: 'Foto Studio ABC',
          email: 'contacto@fotostudioabc.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        };
      } else if (role === 'client') {
        updatedUser = {
          ...updatedUser,
          name: 'Juan Carlos Cruz',
          email: 'juancarlos@ejemplo.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        };
      } else if (role === 'guest') {
        updatedUser = {
          ...updatedUser,
          name: 'Invitado',
          email: 'invitado@eventmarket.com',
          avatar: '',
        };
      }
      return { currentUser: updatedUser };
    });
  },

  setUser: (partialUser) => {
    set((state) => ({ currentUser: { ...state.currentUser, ...partialUser } }));
  },

  // Active Cart Operations
  activeCart: initialCart,

  setCartDetails: (details) => {
    set((state) => ({ activeCart: { ...state.activeCart, ...details } }));
  },

  addServiceToCart: (service, quantity = 1) => {
    set((state) => {
      // Check if service or same category already exists
      const existingIndex = state.activeCart.services.findIndex((s) => s.serviceId === service.id);
      let updatedServices = [...state.activeCart.services];

      if (existingIndex >= 0) {
        const item = updatedServices[existingIndex];
        const newQty = item.quantity + quantity;
        updatedServices[existingIndex] = {
          ...item,
          quantity: newQty,
          subtotal: item.unitPrice * newQty,
        };
      } else {
        const newItem: EventPlanItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          categoryName: service.categoryName,
          providerId: service.providerId,
          providerName: service.providerName,
          providerAvatar: service.providerAvatar,
          unitPrice: service.price,
          quantity,
          subtotal: service.price * quantity,
          priceUnit: service.priceUnit,
          includesSummary: service.includes[0] || service.shortDescription,
        };
        updatedServices.push(newItem);
      }

      return {
        activeCart: {
          ...state.activeCart,
          services: updatedServices,
        },
      };
    });
  },

  removeServiceFromCart: (itemId) => {
    set((state) => ({
      activeCart: {
        ...state.activeCart,
        services: state.activeCart.services.filter((s) => s.id !== itemId),
      },
    }));
  },

  updateServiceQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeServiceFromCart(itemId);
      return;
    }
    set((state) => ({
      activeCart: {
        ...state.activeCart,
        services: state.activeCart.services.map((s) =>
          s.id === itemId
            ? { ...s, quantity, subtotal: s.unitPrice * quantity }
            : s
        ),
      },
    }));
  },

  replaceServiceInCart: (oldItemId, newService) => {
    set((state) => ({
      activeCart: {
        ...state.activeCart,
        services: state.activeCart.services.map((s) => {
          if (s.id !== oldItemId) return s;
          return {
            id: s.id,
            serviceId: newService.id,
            serviceName: newService.name,
            category: newService.category,
            categoryName: newService.categoryName,
            providerId: newService.providerId,
            providerName: newService.providerName,
            providerAvatar: newService.providerAvatar,
            unitPrice: newService.price,
            quantity: s.quantity,
            subtotal: newService.price * s.quantity,
            priceUnit: newService.priceUnit,
            includesSummary: newService.includes[0] || newService.shortDescription,
          };
        }),
      },
    }));
  },

  clonePlanToCart: (plan) => {
    const clonedServices: EventPlanItem[] = plan.services.map((item, idx) => ({
      ...item,
      id: `cloned-${Date.now()}-${idx}`,
    }));

    set((state) => ({
      ...state,
      activeCart: {
        id: `cart-${Date.now()}`,
        name: plan.name,
        typeId: plan.eventTypeId,
        typeName: plan.eventTypeName,
        date: '2026-11-20',
        location: 'Medellín / Valle',
        guestCount: plan.guestCount,
        budget: plan.estimatedPrice,
        services: clonedServices,
      },
    }));
  },

  clearCart: () => {
    set((state) => ({
      ...state,
      activeCart: {
        id: `cart-${Date.now()}`,
        name: 'Nuevo Evento',
        typeId: 'primera-comunion',
        typeName: 'Primera Comunión',
        date: '',
        location: '',
        guestCount: 50,
        budget: 0,
        services: [],
      },
    }));
  },

  getCartSubtotal: () => {
    return get().activeCart.services.reduce((acc, item) => acc + item.subtotal, 0);
  },

  getCartTotal: () => {
    return get().getCartSubtotal();
  },

  // Events List Operations
  events: [...mockInitialEvents],

  createEventFromCart: () => {
    const cart = get().activeCart;
    const subtotal = get().getCartSubtotal();
    const newEvent: AppEvent = {
      id: `evt-${Date.now()}`,
      name: cart.name,
      typeId: cart.typeId,
      typeName: cart.typeName,
      date: cart.date || '2026-12-01',
      location: cart.location || 'Salón Principal',
      guestCount: cart.guestCount,
      budget: cart.budget,
      status: 'draft',
      services: [...cart.services],
      quotedPrice: subtotal,
      depositPaid: 0,
      balanceDue: subtotal,
      createdAt: new Date().toISOString().split('T')[0],
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          daysBefore: 15,
          dayLabel: '15 días antes',
          title: 'Confirmación y anticipos',
          description: 'Aprobación de servicios contratados.',
          status: 'pending',
        },
        {
          id: `tl-${Date.now()}-2`,
          daysBefore: 0,
          dayLabel: 'Día del evento',
          title: 'Ejecución del evento',
          description: 'Inicio de celebración con todos los proveedores.',
          status: 'pending',
        },
      ],
    };

    set((state) => ({ events: [newEvent, ...state.events] }));
    return newEvent;
  },

  saveCartAsQuote: () => {
    const cart = get().activeCart;
    const subtotal = get().getCartSubtotal();
    const newEvent: AppEvent = {
      id: `evt-quote-${Date.now()}`,
      name: cart.name,
      typeId: cart.typeId,
      typeName: cart.typeName,
      date: cart.date || '2026-12-01',
      location: cart.location || 'Salón Principal',
      guestCount: cart.guestCount,
      budget: cart.budget,
      status: 'quoted',
      services: [...cart.services],
      quotedPrice: subtotal,
      depositPaid: 0,
      balanceDue: subtotal,
      createdAt: new Date().toISOString().split('T')[0],
      quoteGeneratedAt: new Date().toISOString().split('T')[0],
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          daysBefore: 15,
          dayLabel: '15 días antes',
          title: 'Revisión técnica de proveedores',
          description: 'Alineación de requerimientos y horarios de llegada.',
          status: 'pending',
        },
        {
          id: `tl-${Date.now()}-2`,
          daysBefore: 0,
          dayLabel: 'Día del evento',
          title: 'Ejecución del evento',
          description: 'Coordinación y entrega de servicios.',
          status: 'pending',
        },
      ],
    };

    set((state) => ({ events: [newEvent, ...state.events] }));
    return newEvent;
  },

  confirmQuote: (eventId: string) => {
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          status: 'confirmed',
          contractedPrice: e.quotedPrice, // Freeze quoted price as contracted price!
        };
      }),
    }));
  },

  simulatePayment: (eventId: string, amount: number) => {
    if (amount <= 0) return;

    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        const newDeposit = e.depositPaid + amount;
        const total = e.contractedPrice || e.quotedPrice;
        const newBalance = Math.max(0, total - newDeposit);
        return {
          ...e,
          status: 'confirmed',
          contractedPrice: total,
          depositPaid: newDeposit,
          balanceDue: newBalance,
        };
      }),
    }));
  },

  updateEventStatus: (eventId: string, status: EventStatus) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? { ...e, status } : e)),
    }));
  },

  // Provider Portal State
  providerServices: [...mockServices],
  providerRequests: [...mockProviderRequests],

  createProviderService: (newServiceData) => {
    const newService: Service = {
      ...newServiceData,
      id: `srv-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ providerServices: [newService, ...state.providerServices] }));
  },

  updateProviderService: (id, updates) => {
    set((state) => ({
      providerServices: state.providerServices.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : s
      ),
    }));
  },

  updateServicePrice: (serviceId, newPrice) => {
    set((state) => ({
      providerServices: state.providerServices.map((s) =>
        s.id === serviceId
          ? { ...s, price: newPrice, updatedAt: new Date().toISOString().split('T')[0] }
          : s
      ),
    }));
  },

  toggleServiceAvailability: (serviceId) => {
    set((state) => ({
      providerServices: state.providerServices.map((s) =>
        s.id === serviceId ? { ...s, available: !s.available } : s
      ),
    }));
  },

  updateRequestStatus: (requestId, status) => {
    set((state) => ({
      providerRequests: state.providerRequests.map((r) =>
        r.id === requestId ? { ...r, status } : r
      ),
    }));
  },

  // Chat Operations
  conversations: [...mockConversations],
  messages: { ...mockMessages },

  sendMessage: (chatId, text, attachmentUrl) => {
    if (!text.trim()) return;

    const role = get().currentUser.role === 'provider' ? 'provider' : 'client';
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: get().currentUser.id,
      senderRole: role,
      text,
      timestamp: 'Ahora',
      status: 'sent',
      attachmentUrl,
    };

    set((state) => {
      const currentMsgs = state.messages[chatId] || [];
      const updatedMsgs = [...currentMsgs, newMessage];

      const updatedConvs = state.conversations.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: 'Ahora',
            }
          : c
      );

      return {
        messages: { ...state.messages, [chatId]: updatedMsgs },
        conversations: updatedConvs,
      };
    });
  },

  // Claims Operations
  claims: [...mockClaims],

  createClaim: (claimData) => {
    if (!claimData.eventId || !claimData.serviceId || !claimData.providerId || !claimData.description.trim()) {
      return null;
    }

    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      eventId: claimData.eventId,
      eventName: claimData.eventName,
      serviceId: claimData.serviceId,
      serviceName: claimData.serviceName,
      providerId: claimData.providerId,
      providerName: claimData.providerName,
      clientId: get().currentUser.id,
      clientName: get().currentUser.name,
      reason: claimData.reason,
      description: claimData.description,
      status: 'open',
      evidenceUrls: claimData.evidenceUrls || [],
      createdAt: new Date().toISOString().split('T')[0],
      responses: [
        {
          id: `resp-${Date.now()}`,
          senderId: get().currentUser.id,
          senderRole: 'client',
          senderName: get().currentUser.name,
          text: claimData.description,
          timestamp: 'Hoy',
        },
      ],
    };

    set((state) => ({ claims: [newClaim, ...state.claims] }));
    return newClaim;
  },

  addClaimResponse: (claimId, text) => {
    const user = get().currentUser;
    const role = user.role === 'provider' ? 'provider' : 'client';
    const newResponse = {
      id: `resp-${Date.now()}`,
      senderId: user.id,
      senderRole: role as 'client' | 'provider',
      senderName: user.name,
      text,
      timestamp: 'Ahora',
    };

    set((state) => ({
      claims: state.claims.map((c) => {
        if (c.id !== claimId) return c;
        const newStatus: ClaimStatus =
          role === 'provider' ? 'awaiting_client' : 'awaiting_provider';
        return {
          ...c,
          status: newStatus,
          responses: [...c.responses, newResponse],
        };
      }),
    }));
  },

  updateClaimStatus: (claimId, status) => {
    set((state) => ({
      claims: state.claims.map((c) => (c.id === claimId ? { ...c, status } : c)),
    }));
  },
}));
