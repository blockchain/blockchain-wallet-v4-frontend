export default ({ nabuUrl, get }) => {
  const fetchRates = pair =>
    get({
      url: nabuUrl,
      endPoint: `/markets/quotes/${pair}`,
      data: { filter: 'eea' },
      ignoreQueryParams: true
    })

  return {
    fetchRates
  }
}
