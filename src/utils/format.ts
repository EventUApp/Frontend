import { EventStatus, ClaimStatus } from '../types';
import { Colors } from '../theme';

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted}`;
}

const SHORT_MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

/** Convierte un ISO `YYYY-MM-DD` en un resumen legible: `20 nov 2026`. */
export function formatShortDate(isoDate: string): string {
  if (!isoDate) {
    return 'Sin fecha';
  }
  const parts = isoDate.split('-');
  if (parts.length < 3) {
    return isoDate;
  }
  const day = String(Number(parts[2]));
  const month = SHORT_MONTHS[Number(parts[1]) - 1] ?? '';
  return `${day} ${month} ${parts[0]}`.trim();
}

/**
 * Configuracion visual de cada estado.
 *
 * `text` usa siempre el tono `*Text` de la paleta, nunca el color
 * saturado: sobre su propio fondo claro el color saturado no llega a
 * 4.5:1 y el texto resulta ilegible. Los tests de contraste lo comprueban.
 *
 * `border` antes era un hex literal por estado; ahora viene de token, para
 * que cambiar la paleta no deje badges con bordes viejos.
 */
export function getEventStatusConfig(status: EventStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'draft':
      return {
        label: 'Borrador',
        bg: Colors.slate100,
        text: Colors.slate600,
        border: Colors.slate300,
      };
    case 'quoted':
      return {
        label: 'Cotizado',
        bg: Colors.infoLight,
        text: Colors.infoText,
        border: Colors.infoBorder,
      };
    case 'confirmed':
      return {
        label: 'Confirmado / Contratado',
        bg: Colors.successLight,
        text: Colors.successText,
        border: Colors.successBorder,
      };
    case 'in_progress':
      return {
        label: 'En Ejecución',
        bg: Colors.accentLight,
        text: Colors.accentDark,
        border: Colors.accentBorder,
      };
    case 'completed':
      return {
        label: 'Finalizado',
        bg: Colors.primaryLight,
        text: Colors.primaryDark,
        border: Colors.primaryBorder,
      };
    case 'cancelled':
      return {
        label: 'Cancelado',
        bg: Colors.dangerLight,
        text: Colors.dangerText,
        border: Colors.dangerBorder,
      };
    default:
      return {
        label: status,
        bg: Colors.slate100,
        text: Colors.slate700,
        border: Colors.slate200,
      };
  }
}

export function getClaimStatusConfig(status: ClaimStatus): {
  label: string;
  bg: string;
  text: string;
} {
  switch (status) {
    case 'open':
      return {
        label: 'Abierto',
        bg: Colors.warningLight,
        text: Colors.warningText,
      };
    case 'in_review':
      return {
        label: 'En Revisión',
        bg: Colors.infoLight,
        text: Colors.infoText,
      };
    case 'awaiting_provider':
      return {
        label: 'Esperando Proveedor',
        bg: Colors.secondaryLight,
        text: Colors.secondaryDark,
      };
    case 'awaiting_client':
      return {
        label: 'Esperando Cliente',
        bg: Colors.accentLight,
        text: Colors.accentDark,
      };
    case 'resolved':
      return {
        label: 'Resuelto',
        bg: Colors.successLight,
        text: Colors.successText,
      };
    case 'rejected':
      return {
        label: 'Rechazado',
        bg: Colors.dangerLight,
        text: Colors.dangerText,
      };
    default:
      return { label: status, bg: Colors.slate100, text: Colors.slate700 };
  }
}