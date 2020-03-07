export type UTXOType = {
  address: string
  change: boolean
  index: number
  path: string
  script: string
  txHash: string
  value: number
  xpub: {
    m: string
    path: string
  }
}

export type FromType =
  | 'ACCOUNT'
  | 'LEGACY'
  | 'WATCH_ONLY'
  | 'EXTERNAL'
  | 'LOCKBOX'
  | 'ADDRESS'

export type PaymentValue = {
  amount?: Array<number>
  change: string
  coins: Array<UTXOType>
  effectiveBalance: number
  fee: number
  fees: {
    limits: {
      max: number
      min: number
    }
    priority: number
    regular: number
  }
  from: Array<string>
  fromAccountIdx: number
  fromType: FromType
  selection?: {
    fee: number
    inputs: Array<UTXOType>
    outputs: Array<UTXOType>
  }
  to?: Array<any>
}

export type PaymentType = {
  amount: (n: number | string) => PaymentType
  build: () => PaymentType
  publish: () => PaymentType
  sign: (pw: string) => PaymentType
  to: (address: string, addressType?: FromType) => PaymentType
  value: () => PaymentValue
}
