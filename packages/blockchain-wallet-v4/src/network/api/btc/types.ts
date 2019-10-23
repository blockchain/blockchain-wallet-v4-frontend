interface AddressAccount {
  account_index: number
  address: string
  change_index: number
  final_balance: number
  n_tx: number
  total_received: number
  total_sent: number
}

interface InputType {
  index: 1
  prev: any
  prev_out: any
  script: string
  sequence: number
  witness: string
}

interface XpubType {
  m: string
  path: string
}

interface OutputType {
  addr: string
  n: number
  script: string
  spent: false
  tx_index: number
  type: number
  value: number
  xpub: XpubType
}

export interface TransactionType {
  balance: number
  block_height: number
  block_index: number
  double_spend: boolean
  fee: number
  hash: string
  inputs: Array<InputType>
  lock_time: number
  out: Array<OutputType>
  relayed_by: string
  result: number
  size: number
  time: number
  tx_index: number
  ver: number
  vin_sz: number
  vout_sz: number
  weight: number
}

export interface MultiaddrResponse {
  addresses: Array<AddressAccount>
  txs: Array<TransactionType>
}
