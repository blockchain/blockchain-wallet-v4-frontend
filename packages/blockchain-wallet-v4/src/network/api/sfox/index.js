export default ({ url }) => {
  const uploadVerificationDocument = (url, file) => fetch(url, {
    method: 'PUT',
    data: file,
    headers: new Headers({
      'Content-Type': 'application/octet-stream'
    })
  }).then(res => {
    return res
  })
  const fetchTradesWithLength = (token, num, apiKey, prod) => {
    let headers = {}
    headers['Authorization'] = 'Bearer ' + token
    headers['X-SFOX-PARTNER-ID'] = apiKey
    headers['content-type'] = 'application/json'
    console.log('fetchTradesWithLength running')
    return fetch(`https://api${prod ? '' : '.staging'}.sfox.com/v2/partner/blockchain/transaction?page_size=${num}`, {
      method: 'GET',
      headers: headers
    }).then(res => res.json())
  }

  return {
    uploadVerificationDocument,
    fetchTradesWithLength
  }
}
