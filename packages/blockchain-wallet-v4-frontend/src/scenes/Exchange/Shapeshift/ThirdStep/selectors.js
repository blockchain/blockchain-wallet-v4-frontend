// import { selectors } from 'data'

export const getData = state => {
  // const order = selectors.components.getOrder(state)
  // const { coinSource, coinTarget } =

  return {
    sourceCoin: 'BTC',
    targetCoin: 'ETH',
    sourceAmount: '0.00001',
    status: 'completed',
    exchangeRate: '0.04406172',
    transactionFee: '0.0002',
    orderId: 'ce86e3e0-42b6-42df-ac17-59add4b013d9',
    depositAmount: '0.00002',
    withdrawalAmount: '0.0006'
  }
}
