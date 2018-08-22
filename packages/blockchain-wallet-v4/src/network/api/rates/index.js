export default ({ nabuUrl, get, post }) => {
  const fetchRates = (pair, volume, fix, fiatCurrency) =>
    post({
      url: nabuUrl,
      endPoint: `/markets/quotes/${pair}/convert?volume=${volume}&fix=${fix}&fiatCurrency=${fiatCurrency}`,
      data: { filter: 'eea' },
      ignoreQueryParams: true
    })

  const fetchAvailablePairs = () =>
    get({
      url: nabuUrl,
      endPoint: `/markets/quotes/pairs`,
      ignoreQueryParams: true
    })

  return {
    fetchRates,
    fetchAvailablePairs
  }
}
