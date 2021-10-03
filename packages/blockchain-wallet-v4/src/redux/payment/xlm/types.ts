import { CustodialFromType } from 'core/types'

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

export type XlmFromType =
  | XlmAccountFromType
  | XlmAddressFromType
  | CustodialFromType
