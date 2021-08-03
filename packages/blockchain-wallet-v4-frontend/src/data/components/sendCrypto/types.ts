// state
export type SendCryptoState = {
  step: SendCryptoStepType
}

export type SendCryptoStepPayload = {
  step: SendCryptoStepType
}

export enum SendCryptoStepType {
  'COIN_SELECTION',
  'ENTER_TO',
  'ENTER_AMOUNT',
  'CONFIRM',
  'RESULT',
  'DETAILS'
}
