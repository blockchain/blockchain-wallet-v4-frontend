export type PairsType = 'BTC-EUR'

export type PairType = {
  buyMax: string
  buyMin: string
  pair: PairsType
}

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
