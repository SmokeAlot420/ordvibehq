// Chemistry-themed messages for Alkanes protocol
export const CHEMISTRY_MESSAGES = {
  // Success messages
  success: [
    "ignition successful: alkane combustion initiated. blue flame detected...",
    "reaction complete: hydrocarbon chain stabilized. entropy decreased...",
    "catalyst activated: bc1p bonds forming. exothermic reaction confirmed...",
    "molecular assembly complete: covalent bonds established. chain verified...",
    "combustion optimal: complete oxidation achieved. CO₂ + H₂O produced...",
    "alkane synthesized: carbon backbone stable. heat released...",
    "chain reaction initiated: branching detected. isomers forming...",
    "fuel mixture optimal: air-alkane ratio perfect. ready to burn..."
  ],
  
  // Error messages
  errors: {
    missingWallet: "hydrocarbon incomplete: taproot catalyst required for ignition",
    missingTwitter: "molecular bond incomplete: X identifier required for chain linkage",
    invalidWallet: "combustion failed: invalid alkane structure (bc1p carbon chain required)",
    invalidTwitter: "isomer rejected: X compound must be 1-15 atoms (alphanumeric chains only)",
    duplicateTwitter: "molecular collision detected: X compound already bonded in chain",
    duplicateWallet: "combustion ongoing: hydrocarbon already burning in the chain",
    generalError: "combustion incomplete: hydrocarbon chain destabilized. retry ignition"
  },
  
  // Status messages
  status: {
    waiting: "alkanes dormant: awaiting catalyst injection...",
    processing: "reaction in progress: bonds forming...",
    complete: "combustion complete: heat released to network...",
    analyzing: "molecular structure analyzing: verifying carbon chains..."
  },
  
  // Terminal status rotations
  terminalStatus: [
    "monitoring hydrocarbon levels...",
    "catalyst temperature: optimal...",
    "chain length: C₁₂H₂₆ detected...",
    "combustion readiness: 100%...",
    "entropy levels: decreasing...",
    "molecular bonds: strengthening...",
    "gas pressure: 1 ATM stable...",
    "ignition temperature: 451°K...",
    "oxidation state: ready...",
    "reaction vessel: pressurized..."
  ],
  
  // Fun facts about alkanes (for tooltips or loading states)
  alkaneFacts: [
    "Alkanes are saturated hydrocarbons with single C-C bonds",
    "Complete combustion of alkanes produces a blue flame",
    "Bitcoin's PoW is like alkane combustion - energy transforms into value",
    "Longer alkane chains have higher boiling points, like deeper Bitcoin blocks",
    "Alkanes are hydrophobic - they repel centralization like water",
    "The simplest alkane is methane (CH₄), Bitcoin is the simplest money",
    "Alkanes follow CₙH₂ₙ₊₂ formula, Bitcoin follows 21M supply formula"
  ]
};

// Chemistry-inspired animation states
export const REACTION_STATES = {
  DORMANT: "dormant",
  CATALYZING: "catalyzing",
  IGNITING: "igniting",
  BURNING: "burning",
  COMPLETE: "complete",
  FAILED: "failed"
};

// Periodic table inspired colors for different states
export const CHEMISTRY_COLORS = {
  carbon: "#1a1a1a",      // Carbon black
  hydrogen: "#ffffff",     // Hydrogen white
  oxygen: "#ff6b6b",      // Oxygen red
  nitrogen: "#4dabf7",    // Nitrogen blue
  catalyst: "#ffd43b",    // Catalyst gold
  flame_blue: "#339af0",  // Complete combustion blue
  flame_yellow: "#ffd43b", // Incomplete combustion yellow
  success: "#51cf66",     // Reaction success green
  error: "#ff6b6b"        // Reaction failed red
};