export default {
  apdus: {
    get_firmware: [0xe0, 0x01, 0x00, 0x00],
    no_op: [0x00, 0x00, 0x00, 0x00]
  },
  providers: {
    '': 1,
    das: 2,
    club: 3,
    shitcoins: 4,
    ee: 5
  },
  scrambleKeys: {
    blockchain: {
      BCH: 'blockchain-bch',
      BTC: 'blockchain-btc',
      DASHBOARD: 'blockchain',
      ETH: 'blockchain-eth'
    },
    ledger: {
      BCH: 'BTC',
      BTC: 'BTC',
      DASHBOARD: 'B0L0S',
      ETH: 'w0w'
    }
  }
}
