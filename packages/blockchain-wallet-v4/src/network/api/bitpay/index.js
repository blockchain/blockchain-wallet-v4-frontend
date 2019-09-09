import axios from 'axios'

export default ({ bitpayUrl }) => {
  /**
   * Makes a request using the invoiceId and returns the raw JSON string retrieved as well as the headers
   * @param invoiceId {string} the bitpay invoiceId
   */
  const getRawPaymentRequest = (invoiceId, chain) =>
    axios({
      strictSSL: true,
      method: 'post',
      url: bitpayUrl + `/i/${invoiceId}`,
      headers: {
        Accept: 'application/payment-options',
        'Content-Type': 'application/payment-request',
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0',
        'x-paypro-version': 2
      },
      data: {
        chain
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

  const verifyPaymentRequest = (invoiceId, tx, weightedSize, chain) =>
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

  const submitPaymentRequest = (invoiceId, tx, weightedSize, chain) =>
    axios({
      url: bitpayUrl + `/i/${invoiceId}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/payment',
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
    verifyPaymentRequest,
    submitPaymentRequest
  }
}
