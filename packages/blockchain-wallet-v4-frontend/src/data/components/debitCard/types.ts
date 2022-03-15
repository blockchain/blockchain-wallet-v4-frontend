// State
import { RemoteDataType } from '@core/remote/types'

export type DebitCardState = {
  cardCreationData: RemoteDataType<string, string>
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
  cardId: string
  cardStatus: string
  createdAt: string
  expiry: string
  last4: string
  orderStatus: [
    {
      date: string
      status: string
    }
  ]
  type: string
}
