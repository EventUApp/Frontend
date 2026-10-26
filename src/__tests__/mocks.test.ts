import { describe, it, expect } from 'vitest';
import { mockPlans, mockServices, mockInitialEvents, mockProviders } from '../mocks';
import { ServiceCategoryId } from '../types';

const VALID_CATEGORIES: ServiceCategoryId[] = [
  'salones',
  'decoracion',
  'fotografia',
  'video',
  'catering',
  'pasteleria',
  'musica',
  'dj',
  'sonido',
  'iluminacion',
  'organizadores',
  'animadores',
  'vestuario',
  'maquillaje',
  'transporte',
  'mobiliario',
  'mesas-sillas',
  'invitaciones',
  'recuerdos',
  'flores',
  'seguridad',
  'logistica',
  'otros',
];

describe('ServiceCategoryId', () => {
  it('should include "organizadores" as a valid category', () => {
    expect(VALID_CATEGORIES).toContain('organizadores');
  });

  it('should not include "Organizadores" (capitalized) as a valid category', () => {
    expect(VALID_CATEGORIES).not.toContain('Organizadores' as ServiceCategoryId);
  });
});

describe('Mock data consistency', () => {
  it('should have valid categories in mockPlans', () => {
    mockPlans.forEach((plan) => {
      plan.services.forEach((service) => {
        expect(VALID_CATEGORIES).toContain(service.category);
      });
    });
  });

  it('should have valid categories in mockServices', () => {
    mockServices.forEach((service) => {
      expect(VALID_CATEGORIES).toContain(service.category);
    });
  });

  it('should have valid categories in mockInitialEvents', () => {
    mockInitialEvents.forEach((event) => {
      event.services.forEach((service) => {
        expect(VALID_CATEGORIES).toContain(service.category);
      });
    });
  });

  it('should have images array in mockServices', () => {
    mockServices.forEach((service) => {
      expect(Array.isArray(service.images)).toBe(true);
    });
  });

  it('should have images array in mockProviders', () => {
    mockProviders.forEach((provider) => {
      expect(Array.isArray(provider.gallery)).toBe(true);
    });
  });
});

describe('Mock data integrity', () => {
  it('should have unique IDs in mockPlans', () => {
    const ids = mockPlans.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique IDs in mockServices', () => {
    const ids = mockServices.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique IDs in mockInitialEvents', () => {
    const ids = mockInitialEvents.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have consistent subtotals in mockPlans', () => {
    mockPlans.forEach((plan) => {
      plan.services.forEach((service) => {
        const expectedSubtotal = service.unitPrice * service.quantity;
        expect(service.subtotal).toBe(expectedSubtotal);
      });
    });
  });
});
