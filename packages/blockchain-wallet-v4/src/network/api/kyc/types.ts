export type SDDEligibleType = {
  eligible: boolean
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION'
  tier: 0 | 1 | 2 | 3 | 4
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
  id: string
  instructions?: string
  isDropdown?: boolean
  text: string
  type: string
}

export type ExtraQuestionsType = {
  nodes: Array<NodeType>
}
