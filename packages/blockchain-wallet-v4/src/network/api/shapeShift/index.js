export default ({ shapeShiftApiKey }) => {
  // checkStatus :: Response -> Promise Response
  const checkStatus = (r) => r.ok ? Promise.resolve(r) : r.text().then(j => Promise.reject(j))

  // extractData :: Response -> Promise (JSON | BLOB | TEXT)
  const extractData = (r) => {
    const responseOfType = (t) => r.headers.get('content-type') && r.headers.get('content-type').indexOf(t) > -1
    switch (true) {
      case responseOfType('application/json'): return r.json()
      case responseOfType('image/jpeg'): return r.blob()
      default: return r.text()
    }
  }

  const request = (method, endpoint, data) => {
    let url = 'https://shapeshift.io/' + endpoint
    let options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit'
    }

    if (method !== 'GET') {
      options.body = JSON.stringify(data)
    }

    return fetch(url, options).then(checkStatus).then(extractData)
  }

  // Get and post requests
  const get = ({ endPoint }) => request('GET', endPoint, {})
  const post = ({ endPoint, ...data }) => request('POST', endPoint, data)

  const getPair = (pair) => get({
    endPoint: `marketinfo/${pair}`
  })

  const getTradeStatus = (address) => get({
    endPoint: `txStat/${address}`
  })

  const createQuote = (amount, pair, isDeposit) => isDeposit
    ? post({ endPoint: 'sendamount', apiKey: shapeShiftApiKey, depositAmount: amount, pair })
    : post({ endPoint: 'sendamount', apiKey: shapeShiftApiKey, withdrawalAmount: amount, pair })

  const createOrder = (depositAmount, pair, returnAddress, withdrawal) => post({
    endPoint: 'sendamount', apiKey: shapeShiftApiKey, depositAmount, pair, returnAddress, withdrawal
  })

  return {
    getPair,
    getTradeStatus,
    createQuote,
    createOrder
  }
}
