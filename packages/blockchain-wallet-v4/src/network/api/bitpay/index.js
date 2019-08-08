import axios from 'axios'

export default ({ bitpayUrl }) => {
  /**
   * Makes a request using the invoiceId and returns the raw JSON string retrieved as well as the headers
   * @param invoiceId {string} the bitpay invoiceId
   */
  const getRawPaymentRequest = invoiceId =>
    axios({
      strictSSL: true,
      method: 'get',
      url: bitpayUrl + `/i/${invoiceId}`,
      headers: {
        Accept: 'application/payment-request'
      }
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.data.toString())
        }
        return {
          rawBody: JSON.stringify(response.data),
          headers: response.headers
        }
      })
      .catch(error => {
        if (error) {
          throw new Error(error)
        }
      })

  return {
    getRawPaymentRequest
  }
}
