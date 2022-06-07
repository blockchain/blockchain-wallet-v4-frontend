// State
import { RemoteDataType } from '@core/remote/types'

export type DebitCardState = {
  cardCreationData: RemoteDataType<string, string>
  cardToken: string
  cards: RemoteDataType<string, Array<DebitCardType>>
  currentCardAccount: RemoteDataType<string, AccountType>
  currentCardSelected: DebitCardType | undefined
  eligibleAccounts: RemoteDataType<string, Array<AccountType>>
  lockHandler: RemoteDataType<string, boolean>
  products: Array<ProductType>
  terminateHandler: RemoteDataType<string, string>
}

export type ProductType = {
  brand: string
  price: {
    symbol: string
    value: number
  }
  productCode: string
  type: string
}

export type DebitCardType = {
  brand: string
  createdAt: string
  expiry: string
  id: string
  last4: string
  status: CardStateType
  type: string
}

export type CardActionType = {
  id: string
  newLockState: boolean
}

export enum CardStateType {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  TERMINATED = 'TERMINATED'
}

export type BalanceType = {
  symbol: string
  value: string
}

export type AccountType = {
  balance: BalanceType
}
