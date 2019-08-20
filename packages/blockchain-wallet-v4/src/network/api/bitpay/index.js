import axios from 'axios'

export default ({ bitpayUrl, get, post }) => {
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
        Accept: 'application/payment-request',
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0'
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

  const submitPaymentRequest = (invoiceId, tx, weightedSize, chain) =>
    axios({
      url: bitpayUrl + `/i/${invoiceId}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/payment-verification',
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0',
        'x-paypro-version': 2
      },
      data: {
        chain,
        transactions: [{ tx, weightedSize }]
      }
    })

  return {
    getRawPaymentRequest,
    submitPaymentRequest
  }
}
