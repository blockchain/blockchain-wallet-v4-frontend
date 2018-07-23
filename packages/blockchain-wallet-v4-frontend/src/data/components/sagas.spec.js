import Sagas from './sagas'

describe('Component Sagas', () => {
  it('should export correct sagas', () => {
    const sagas = Sagas({ api: {}, coreSagas: {}, options: {} })

    expect(sagas.activityList).toBeDefined()
    expect(sagas.bchTransactions).toBeDefined()
    expect(sagas.btcTransactions).toBeDefined()
    expect(sagas.ethTransactions).toBeDefined()
    expect(sagas.exchange).toBeDefined()
    expect(sagas.exchangeHistory).toBeDefined()
    expect(sagas.identityVerification).toBeDefined()
    expect(sagas.importBtcAddress).toBeDefined()
    expect(sagas.manageAddresses).toBeDefined()
    expect(sagas.priceChart).toBeDefined()
    expect(sagas.priceTicker).toBeDefined()
    expect(sagas.refresh).toBeDefined()
    expect(sagas.requestBtc).toBeDefined()
    expect(sagas.sendBch).toBeDefined()
    expect(sagas.sendBtc).toBeDefined()
    expect(sagas.sendEth).toBeDefined()
    expect(sagas.settings).toBeDefined()
    expect(sagas.signMessage).toBeDefined()
    expect(sagas.transactionReport).toBeDefined()
  })
})
