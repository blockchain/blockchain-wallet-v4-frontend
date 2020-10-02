import { FiatType } from 'core/types'

type RawBtcAddressType = {
  account_index: number
  address: string
  change_index: number
  final_balance: number
  n_tx: number
  total_received: number
  total_sent: number
}

export type RawBtcTxType = {
  balance: number
  block_height: number
  block_index: number
  double_spend: boolean
  fee: number
  hash: string
  inputs: Array<BtcIOType>
  lock_time: number
  out: Array<BtcIOType>
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

type BtcIOType = {
  index: number
  prev_out: {
    addr: string
    n: number
    script: string
    spending_outpoints: [{ n: number; tx_index: number }]
    spent: boolean
    tx_index: number
    type: number
    value: number
  }
  script: string
  sequence: number
  witness: string
  xpub?: {
    m: string
    path: string
  }
}

export type RawBtcTxResponseType = {
  addresses: Array<RawBtcAddressType>
  info: {
    conversion: number
    latest_block: {
      block_index: number
      hash: string
      height: number
      time: number
    }
    nconnected: number
    symbol_btc: {
      code: 'BTC'
      conversion: 100000000.0
      local: false
      name: 'Bitcoin'
      symbol: 'BTC'
      symbolAppearsAfter: boolean
    }
    symbol_local: {
      code: FiatType
      conversion: number
      local: boolean
      name: string
      symbol: string
      symbolAppearsAfter: boolean
    }
  }
  recommend_include_fee: boolean
  txs: Array<RawBtcTxType>
  wallet: {
    final_balance: number
    n_tx: number
    n_tx_filtered: number
    total_received: number
    total_sent: number
  }
}
