
// TODO: remake mock to be based on actual sagas:
// If they cease to exist mocks must also break
export default () => ({
  wallet: {
    createWalletSaga: jest.fn(),
    fetchWalletSaga: jest.fn(),
    remindWalletGuidSaga: jest.fn(),
    resendSmsLoginCode: jest.fn(),
    resetWallet2fa: jest.fn(),
    restoreWalletSaga: jest.fn()
  },
  kvStore: {
    root: {
      fetchRoot: jest.fn()
    },
    ethereum: {
      fetchMetadataEthereum: jest.fn()
    },
    bch: {
      fetchMetadataBch: jest.fn()
    }
  }
})
