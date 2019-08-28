export default {
  apdus: {
    get_btc_app_version: [0xe0, 0xc4, 0x00, 0x00],
    get_firmware: [0xe0, 0x01, 0x00, 0x00],
    no_op: [0x00, 0x00, 0x00, 0x00]
  },
  appIds: {
    BTC: 1,
    BCH: 2,
    ETH: 18,
    XLM: 27
  },
  providers: {
    '': 1,
    das: 2,
    club: 3,
    shitcoins: 4,
    ee: 5,
    bc: 6
  },
  scrambleKeys: {
    blockchain: {
      BCH: 'bch-blockchain',
      BTC: 'btc-blockchain',
      DASHBOARD: 'blockchain',
      ETH: 'eth-blockchain',
      XLM: 'xlm-blockchain'
    },
    ledger: {
      BCH: 'BTC',
      BTC: 'BTC',
      DASHBOARD: 'B0L0S',
      ETH: 'w0w',
      XLM: 'l0v'
    }
  },
  socketPaths: {
    authenticity: '/update/genuine',
    install: '/update/install',
    mcu: '/update/mcu'
  },
  supportedApps: {
    BTC: 'Bitcoin',
    BCH: 'Bitcoin Cash',
    ETH: 'Ethereum',
    XLM: 'Stellar'
  }
}
