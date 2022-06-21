export type SDDEligibleType = {
  eligible: boolean
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION'
  tier: 0 | 1 | 2 | 3 | 4
}

export enum CountryScope {
  KYC = 'KYC',
  MERCURY = 'MERCURY',
  SIGNUP = 'SIGNUP'
}

export type CountryScopeType = keyof typeof CountryScope

export enum ExtraKYCContext {
  FIAT_DEPOSIT = 'FIAT_DEPOSIT',
  TIER_TWO_VERIFICATION = 'TIER_TWO_VERIFICATION'
}

export enum NodeItemTypes {
  MULTIPLE_SELECTION = 'MULTIPLE_SELECTION',
  OPEN_ENDED = 'OPEN_ENDED',
  SINGLE_SELECTION = 'SINGLE_SELECTION'
}

export type SDDVerifiedType = {
  taskComplete?: boolean
  verified: boolean
}

type QuestionItem = {
  checked?: boolean
  hint?: string
  id: string
  input?: string
  text: string
  type: string
}

type NodeItem = {
  checked?: boolean
  children?: Array<QuestionItem>
  id: string
  text: string
  type: string
}

export type NodeType = {
  children: Array<NodeItem>
  hint?: string
  id: string
  input?: string
  instructions?: string
  isDropdown?: boolean
  regex?: string
  text: string
  type: string
}

export type NodeTextType = {
  hint?: string
  id: string
  input?: string
  instructions?: string
  regex?: string
  text: string
  type: string
}

export type ExtraQuestionsType = {
  blocking: boolean
  context: keyof typeof ExtraKYCContext
  nodes: Array<NodeType>
}
