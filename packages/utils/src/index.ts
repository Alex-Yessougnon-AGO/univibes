import slugify from 'slugify';

// =====================================================
// SLUG
// =====================================================

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'fr',
    trim: true,
  });
}

// =====================================================
// DATE FORMATTERS
// =====================================================

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function isUpcoming(date: Date | string): boolean {
  return new Date(date) > new Date();
}

// =====================================================
// CURRENCY FORMATTERS
// =====================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K FCFA`;
  return `${amount} FCFA`;
}

// =====================================================
// VALIDATION
// =====================================================

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Format Bénin : +229XXXXXXXX
  const re = /^\+?[0-9]{8,15}$/;
  return re.test(phone);
}

// =====================================================
// PAGINATION
// =====================================================

export function getPaginationParams(
  page: number = 1,
  limit: number = 20,
  maxLimit: number = 50,
): { skip: number; take: number; page: number; limit: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), maxLimit);
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
    page: safePage,
    limit: safeLimit,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// =====================================================
// STRING UTILS
// =====================================================

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
