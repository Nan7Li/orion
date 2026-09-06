/**
 * Open-source & curated list of common disposable/temporary email provider domains
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  'mailinator.com',
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'throwawaymail.com',
  'dispostable.com',
  'getairmail.com',
  'mohmal.com',
  'fakemailgenerator.com',
  'crazymailing.com',
  'generator.email',
  'emailfake.com',
  'dropmail.me',
  'mytemp.email',
  'disposablemail.com',
  'inboxkitten.com',
  'nada.ltd',
  'getnada.com',
  'tempail.com',
  'smailpro.com',
  'burnermail.io'
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
