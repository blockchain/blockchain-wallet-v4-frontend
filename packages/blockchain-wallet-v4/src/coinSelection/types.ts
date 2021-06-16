export interface ICoinSelectionCoinIO {
  address: string
  change: boolean
  index: number
  path: string
  priv: string
  script: string
  txHash: string
  value: number
  xpub: string
}

export interface ISelection {
  fee: number
  inputs: ICoinSelectionCoinIO[]
  outputs: ICoinSelectionCoinIO[]
}
