export default ({ rootUrl, get }) => {
  const incrementCurrencyUsageStats = (
    btcBalance,
    ethBalance,
    bchBalance,
    xlmBalance
  ) =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: {
        name: `wallet_login_balance_btc_${btcBalance > 0 ? 1 : 0}_eth_${
          ethBalance > 0 ? 1 : 0
        }_bch_${bchBalance > 0 ? 1 : 0}_xlm_${xlmBalance > 0 ? 1 : 0}`
      }
    })

  return {
    incrementCurrencyUsageStats
  }
}
