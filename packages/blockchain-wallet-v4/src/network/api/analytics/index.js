export default ({ rootUrl, apiUrl, get, post }) => {
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

  const logLockboxSetup = step =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_web_lockbox_${step}` }
    })

  const logClick = name =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_web_click_${name}` }
    })

  const logKycEvent = event =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_web_kyc_${event}` }
    })

  const logExchangeEvent = event =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `wallet_web_exchange_${event}` }
    })

  const logSfoxAccountCreation = () =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `sfox_account_creation` }
    })

  const logSfoxQuote = type =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: type }
    })

  const logSfoxTrade = type =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: type }
    })

  const logSfoxDropoff = step =>
    get({
      url: rootUrl,
      endPoint: '/event',
      data: { name: `sfox_dropoff_${step}` }
    })

  return {
    incrementCurrencyUsageStats,
    incrementLoginViaQrStats,
    incrementSecPasswordStats,
    incrementStat,
    logClick,
    logKycEvent,
    logExchangeEvent,
    logLockboxSetup,
    logSfoxAccountCreation,
    logSfoxDropoff,
    logSfoxQuote,
    logSfoxTrade
  }
}
