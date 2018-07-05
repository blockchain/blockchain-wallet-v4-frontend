
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
  },
  data: {
    sfox: {
      signup: jest.fn(),
      setBankAccount: jest.fn(),
      handleTrade: jest.fn(),
      setProfile: jest.fn(),
      verifyMicroDeposits: jest.fn()
    },
    coinify: {
      signup: jest.fn(),
      buy: jest.fn(),
      sell: jest.fn(),
      initialized: jest.fn(),
      getKYC: jest.fn(),
      triggerKYC: jest.fn(),
      cancelTrade: jest.fn(),
      cancelSubscription: jest.fn(),
      kycAsTrade: jest.fn(),
      deleteBankAccount: jest.fn(),
      getMediumsWithBankAccounts: jest.fn()
    }
  },
  payment: {
    btc: {
      create: jest.fn()
    }
  }
})
