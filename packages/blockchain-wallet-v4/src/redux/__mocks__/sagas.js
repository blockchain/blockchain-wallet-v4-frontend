export default () => ({
  wallet: {
    createWalletSaga: jest.fn(),
    fetchWalletSaga: jest.fn(),
    remindWalletGuidSaga: jest.fn(),
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
