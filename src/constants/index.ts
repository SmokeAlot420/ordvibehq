// Error codes
export const ERROR_CODES = {
  DUPLICATE_ENTRY: '23505',
} as const

// Form validation patterns
export const VALIDATION_PATTERNS = {
  TWITTER_HANDLE: /^@?[A-Za-z0-9_]+$/,
  TAPROOT_WALLET: /^(bc1p|tb1p)[a-z0-9]{58,62}$/i,
} as const

// UI Messages
export const MESSAGES = {
  WALLET_EXISTS: 'This wallet has already been whitelisted',
  SUBMISSION_SUCCESS: 'Successfully added to whitelist!',
  SUBMISSION_ERROR: 'Failed to submit. Please try again.',
  INVALID_TWITTER: 'Please enter a valid Twitter handle',
  INVALID_WALLET: 'Please enter a valid Taproot wallet address',
} as const

// Form placeholders
export const PLACEHOLDERS = {
  TWITTER: '@satoshi',
  WALLET: 'bc1p...',
} as const