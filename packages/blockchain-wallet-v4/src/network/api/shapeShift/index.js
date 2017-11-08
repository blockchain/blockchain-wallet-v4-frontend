export default ({ shapeShiftRootUrl }) => {
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
    console.log('Making shapeshift request ' + endpoint)

    let url = shapeShiftRootUrl + endpoint
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

  // Get request
  const get = ({ endPoint }) => request('GET', endPoint, {})

  const getBtcEth = () => get({
    endPoint: `marketinfo/btc_eth`
  })

  const getEthBtc = () => get({
    endPoint: `marketinfo/eth_btc`
  })

  return {
    getBtcEth,
    getEthBtc
  }
}
