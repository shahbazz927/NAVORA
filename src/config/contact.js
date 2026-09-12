// Centralized contact & prototype legal config for NAVORA.
// Update this single file when contact details or entity status changes post-incorporation.

export const CONTACT = {
  brand: 'NAVORA',
  email: 'NAVORA.Edu07@gmail.com',
  phones: ['+91 86860 50555', '+91 86881 58266'],
  // For tel: links strip spaces — use telHref helper
};

export function telHref(phone) {
  return `tel:${phone.replace(/\s/g, '')}`;
}

export const LEGAL = {
  // Prototype status — no registered entity yet. Do not invent CIN/GSTIN/address.
  statusNote: 'NAVORA is an education and career guidance platform currently under development (prototype / pre-incorporation).',
  // Fields that will be populated after incorporation — intentionally null for now
  entityName: null,
  registeredAddress: null,
  cin: null,
  gstin: null,
  jurisdiction: null,
  effectiveDate: null,
};
