export type XlmAccountFromType = {
  address: string
  balance: string
  coin: 'XLM'
  label: string
  type: 'ACCOUNT' | 'LOCKBOX'
}

export type XlmAddressFromType = {
  address: string
  type: 'ADDRESS'
}

export type XlmCustodialFromType = {
  available: string
  fiatAmount: null
  label: string
  pending: string
  type: 'CUSTODIAL'
}

export type XlmFromType =
  | XlmAccountFromType
  | XlmAddressFromType
  | XlmCustodialFromType
