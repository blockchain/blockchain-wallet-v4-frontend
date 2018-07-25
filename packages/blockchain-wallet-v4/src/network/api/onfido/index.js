export default ({ rootUrl, get, post }) => {
  const fetchOnfidoSDKKey = () =>
    // get({
    //   url: rootUrl,
    //   endPoint: '/kyc/credentials/ONFIDO'
    // })
    get({
      url: 'https://token-factory.onfido.com',
      endPoint: '/sdk_token',
      ignoreKey: true,
      contentType: 'application/json'
    })

  const syncOnfido = applicantId =>
    // post({
    //   url: rootUrl,
    //   endPoint: '/kyc/verification',
    //   data: { applicantId }
    // })
    Promise.resolve({
      applicantId: '4ad8273f-e028-4d4c-b258-0349eb88308c'
    })

  return {
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
