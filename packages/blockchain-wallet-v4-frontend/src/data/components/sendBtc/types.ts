import { CoinTypeEnum, PaymentValue, RemoteDataType } from 'core/types'

export type AccountType = {
  address: string
  agent: {
    account: string | null
    accountType: string | null
    address: string | null
    code: string | null
    country: string | null
    name: string | null
    recipient: string | null
    recipientAddress: string | null
    routingNumber: string | null
    swiftCode: string | null
  }
  currency: CoinTypeEnum
  id: string
  state: 'PENDING' | 'ACTIVE'
}

// State
export type SendBtcState = {
  account: AccountType
  feePerByteToggled: boolean
  payment: RemoteDataType<string, PaymentValue>
  step: 1 | 2
}
