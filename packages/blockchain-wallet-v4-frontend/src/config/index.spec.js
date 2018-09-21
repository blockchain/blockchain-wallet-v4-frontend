import Config from './index'

jest.mock('bitcoinjs-lib', () => ({
  networks: {
    bitcoin: 'MOCK_BTC',
    testnet: 'MOCK_TESTNET_BTC'
  }
}))

jest.mock('bitcoinforksjs-lib', () => ({
  networks: {
    bitcoin: 'MOCK_BCH',
    testnet: 'MOCK_TESTNET_BCH'
  }
}))

describe('application config constants', () => {
  it('returns correct defaults', () => {
    expect(Config.WALLET_DATA_PATH).toEqual('wallet.data')
    expect(Config.WALLET_PAYLOAD_PATH).toEqual('wallet.payload')
    expect(Config.WALLET_SETTINGS_PATH).toEqual('wallet.settings')
    expect(Config.WALLET_OPTIONS_PATH).toEqual('wallet.options')
    expect(Config.WALLET_KVSTORE_PATH).toEqual('wallet.kvstore')
    expect(Config.NETWORK_ETH).toEqual(1)
    expect(Config.NETWORK_BCH).toEqual('MOCK_BCH')
  })
})
