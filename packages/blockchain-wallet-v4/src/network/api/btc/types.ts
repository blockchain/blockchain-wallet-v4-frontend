export type UnspentResponseType = {
  notice: string
  unspent_outputs: {
    confirmations: number
    script: string
    tx_hash: string
    tx_hash_big_endian: string
    tx_index: number
    tx_output_n: number
    value: number
    value_hex: string
    xpub?: {
      m: string
      path: string
    }
  }[]
}
