export default ({ get, nabuUrl, post }) => {
  const fetchAdvice = (pair, volume, fix, fiatCurrency) =>
    post({
      url: nabuUrl,
      endPoint: `/markets/quotes/${pair}/convert?volume=${volume}&fix=${fix}&fiatCurrency=${fiatCurrency}`,
      ignoreQueryParams: true
    })

  const fetchAvailablePairs = () =>
    get({
      url: nabuUrl,
      endPoint: `/markets/quotes/pairs`,
      ignoreQueryParams: true
    })

  const fetchBestRates = pairs =>
    get({
      url: nabuUrl,
      endPoint: `/markets/bestrates?currencyPairs=${pairs.join(',')}`,
      ignoreQueryParams: true
    })

  return {
    fetchAdvice,
    fetchAvailablePairs,
    fetchBestRates
  }
}
