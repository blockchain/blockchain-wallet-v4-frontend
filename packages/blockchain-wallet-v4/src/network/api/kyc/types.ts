export enum CountryScope {
  KYC = 'KYC',
  MERCURY = 'MERCURY',
  SIGNUP = 'SIGNUP'
}

export type CountryScopeType = keyof typeof CountryScope

export enum ExtraKYCContext {
  FIAT_DEPOSIT = 'FIAT_DEPOSIT',
  FIAT_WITHDRAW = 'FIAT_WITHDRAW',
  SELF_CLASSIFICATION = 'SELF_CLASSIFICATION',
  TIER_TWO_VERIFICATION = 'TIER_TWO_VERIFICATION',
  TRADING = 'TRADING'
}

export enum NodeItemTypes {
  INFO = 'INFO',
  MULTIPLE_SELECTION = 'MULTIPLE_SELECTION',
  OPEN_ENDED = 'OPEN_ENDED',
  SELECTION = 'SELECTION',
  SINGLE_CHECKBOX = 'SINGLE_CHECKBOX',
  SINGLE_SELECTION = 'SINGLE_SELECTION'
}

export type VerifiedType = {
  taskComplete?: boolean
  verified: boolean
}

export type NodeItem = {
  checked?: boolean
  children?: Array<NodeItem>
  description?: string
  hint?: string
  id: string
  input?: string
  instructions?: string
  isDropdown?: boolean
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

export type HeaderType = {
  description?: string
  imageUrl?: string
  title: string
}

export type ExtraQuestionsType = {
  blocking: boolean
  context: keyof typeof ExtraKYCContext
  header?: HeaderType
  nodes: Array<NodeItem>
}

export type KycFlowsType = {
  attributes: Object
  nextFlow: string
}
