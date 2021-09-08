export default ({ get, nabuUrl, post }) => {
  const fetchAdvice = (pair, volume, fix, fiatCurrency) =>
    post({
      endPoint: `/markets/quotes/${pair}/convert?volume=${volume}&fix=${fix}&fiatCurrency=${fiatCurrency}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const fetchAvailablePairs = () =>
    get({
      endPoint: `/markets/quotes/pairs`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const fetchBestRates = (pairs) =>
    get({
      endPoint: `/markets/bestrates?currencyPairs=${pairs.join(',')}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  return {
    fetchAdvice,
    fetchAvailablePairs,
    fetchBestRates
  }
}
