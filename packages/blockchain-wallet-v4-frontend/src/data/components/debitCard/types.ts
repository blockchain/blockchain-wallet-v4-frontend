// State
import { RemoteDataType } from '@core/remote/types'

export type DebitCardState = {
  cardCreationData: RemoteDataType<string, string>
  cardToken: string
  cards: Array<DebitCardType>
  lockHandler: RemoteDataType<string, boolean>
  products: Array<ProductType>
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
