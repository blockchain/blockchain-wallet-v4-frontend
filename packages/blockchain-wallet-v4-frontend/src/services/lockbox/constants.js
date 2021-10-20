export default {
  apdus: {
    get_btc_app_version: [0xe0, 0xc4, 0x00, 0x00],
    get_firmware: [0xe0, 0x01, 0x00, 0x00],
    no_op: [0x00, 0x00, 0x00, 0x00]
  },
  appIds: {
    BCH: 2,
    BTC: 1,
    ETH: 18,
    XLM: 27
  },
  providers: {
    '': 1,
    bc: 6,
    club: 3,
    das: 2,
    ee: 5,
    shitcoins: 4
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
    BCH: 'Bitcoin Cash',
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    XLM: 'Stellar'
  }
}
