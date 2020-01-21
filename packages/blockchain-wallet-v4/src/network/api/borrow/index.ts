export default ({ nabuUrl, authorizedGet, authorizedPost, authorizedPut }) => {
  const getOffers = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/lending/offers'
    })

  return {
    getOffers
  }
}
