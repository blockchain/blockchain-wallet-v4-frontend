export type BtcAPI = {
  getBtcTicker: () => any
  getBtcUnspents: (fromAddresses: any, confirmations?: number) => any
  getBtcFees: () => any
  pushBtcTx: (txHex: any) => any
  getBtcFiatAtTime: (amount: any, currency: any, time: any) => any
  getLatestBlock: () => any
  getRawTx: (txHex: any) => any
  getBalances: (addresses: any) => any
}
