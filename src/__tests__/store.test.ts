import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { mockPlans, mockServices, mockConversations, mockMessages, mockClaims, mockProviderRequests, mockInitialEvents } from '../mocks';

describe('useAppStore', () => {
  beforeEach(() => {
    const state = useAppStore.getState();
    useAppStore.setState({
      currentUser: {
        id: 'usr-client-1',
        name: 'Juan Carlos Cruz',
        email: 'juancarlos@ejemplo.com',
        role: 'client',
        avatar: 'https://example.com/avatar.jpg',
        phone: '+57 310 456 7890',
        location: 'Cali',
      },
      activeCart: {
        id: 'cart-active-1',
        name: 'Mi Primera Comunión Familiar',
        typeId: 'primera-comunion',
        typeName: 'Primera Comunión',
        date: '2026-11-20',
        location: 'Valle del Cauca',
        guestCount: 50,
        budget: 2500000,
        services: [...mockPlans[0].services],
      },
      events: [...mockInitialEvents],
      providerServices: [...mockServices],
      providerRequests: [...mockProviderRequests],
      conversations: [...mockConversations],
      messages: { ...mockMessages },
      claims: [...mockClaims],
    });
  });

  describe('clonePlanToCart', () => {
    it('should preserve currentUser when cloning plan to cart', () => {
      const { clonePlanToCart } = useAppStore.getState();
      const originalUser = useAppStore.getState().currentUser;

      clonePlanToCart(mockPlans[0]);

      expect(useAppStore.getState().currentUser).toEqual(originalUser);
    });

    it('should preserve events when cloning plan to cart', () => {
      const { clonePlanToCart } = useAppStore.getState();
      const originalEvents = useAppStore.getState().events;

      clonePlanToCart(mockPlans[0]);

      expect(useAppStore.getState().events).toEqual(originalEvents);
    });

    it('should preserve claims when cloning plan to cart', () => {
      const { clonePlanToCart } = useAppStore.getState();
      const originalClaims = useAppStore.getState().claims;

      clonePlanToCart(mockPlans[0]);

      expect(useAppStore.getState().claims).toEqual(originalClaims);
    });

    it('should set activeCart with cloned services', () => {
      const { clonePlanToCart } = useAppStore.getState();

      clonePlanToCart(mockPlans[0]);

      const { activeCart } = useAppStore.getState();
      expect(activeCart.name).toBe(mockPlans[0].name);
      expect(activeCart.services.length).toBe(mockPlans[0].services.length);
      expect(activeCart.services[0].id).toMatch(/^cloned-/);
    });
  });

  describe('clearCart', () => {
    it('should preserve currentUser when clearing cart', () => {
      const { clearCart } = useAppStore.getState();
      const originalUser = useAppStore.getState().currentUser;

      clearCart();

      expect(useAppStore.getState().currentUser).toEqual(originalUser);
    });

    it('should preserve events when clearing cart', () => {
      const { clearCart } = useAppStore.getState();
      const originalEvents = useAppStore.getState().events;

      clearCart();

      expect(useAppStore.getState().events).toEqual(originalEvents);
    });

    it('should preserve claims when clearing cart', () => {
      const { clearCart } = useAppStore.getState();
      const originalClaims = useAppStore.getState().claims;

      clearCart();

      expect(useAppStore.getState().claims).toEqual(originalClaims);
    });

    it('should reset activeCart to empty state', () => {
      const { clearCart } = useAppStore.getState();

      clearCart();

      const { activeCart } = useAppStore.getState();
      expect(activeCart.name).toBe('Nuevo Evento');
      expect(activeCart.services).toEqual([]);
      expect(activeCart.guestCount).toBe(50);
      expect(activeCart.budget).toBe(0);
    });
  });

  describe('initialCart', () => {
    it('should not share reference with mockPlans[0].services', () => {
      const { activeCart } = useAppStore.getState();
      expect(activeCart.services).not.toBe(mockPlans[0].services);
      expect(activeCart.services).toEqual(mockPlans[0].services);
    });
  });

  describe('sendMessage', () => {
    it('should not send empty messages', () => {
      const { sendMessage } = useAppStore.getState();
      const originalMessages = useAppStore.getState().messages;

      sendMessage('chat-1', '');

      expect(useAppStore.getState().messages).toEqual(originalMessages);
    });

    it('should not send whitespace-only messages', () => {
      const { sendMessage } = useAppStore.getState();
      const originalMessages = useAppStore.getState().messages;

      sendMessage('chat-1', '   ');

      expect(useAppStore.getState().messages).toEqual(originalMessages);
    });
  });

  describe('simulatePayment', () => {
    it('should not process negative amounts', () => {
      const { simulatePayment } = useAppStore.getState();
      const originalEvents = useAppStore.getState().events;

      simulatePayment('evt-101', -1000);

      expect(useAppStore.getState().events).toEqual(originalEvents);
    });

    it('should not process zero amount', () => {
      const { simulatePayment } = useAppStore.getState();
      const originalEvents = useAppStore.getState().events;

      simulatePayment('evt-101', 0);

      expect(useAppStore.getState().events).toEqual(originalEvents);
    });
  });

  describe('createClaim', () => {
    it('should not create claim with empty required fields', () => {
      const { createClaim } = useAppStore.getState();
      const originalClaims = useAppStore.getState().claims;

      createClaim({
        eventId: '',
        eventName: '',
        serviceId: '',
        serviceName: '',
        providerId: '',
        providerName: '',
        reason: '',
        description: '',
      });

      expect(useAppStore.getState().claims).toEqual(originalClaims);
    });
  });
});
