export default ({ rootUrl, apiUrl, get, post }) => {
  const incrementCurrencyUsageStats = (btcBalance, ethBalance, bchBalance) =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: {
        name: `wallet_login_balance_btc_${btcBalance > 0 ? 1 : 0}_eth_${
          ethBalance > 0 ? 1 : 0
        }_bch_${bchBalance > 0 ? 1 : 0}`
      }
    })

  const incrementLoginViaQrStats = () =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: 'wallet_login_second_password_wallet_web_login_via_qr' }
    })

  const incrementStat = eventName =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: 'wallet_web_login_via', mode: 'no-cors' }
    })

  const incrementSecPasswordStats = secondPassActive =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_login_second_password_${secondPassActive ? 1 : 0}` }
    })

  const logClick = name =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_web_click_${name}` }
    })

  return {
    incrementCurrencyUsageStats,
    incrementLoginViaQrStats,
    incrementSecPasswordStats,
    incrementStat,
    logClick
  }
}
