import axios from 'axios'

export default ({ bitpayUrl }) => {
  /**
   * Makes a request using the invoiceId and returns the raw JSON string retrieved as well as the headers
   * @param invoiceId {string} the bitpay invoiceId
   */
  const getRawPaymentRequest = (invoiceId, chain) =>
    axios({
      data: {
        chain
      },
      headers: {
        Accept: 'application/payment-options',
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0',
        'Content-Type': 'application/payment-request',
        'x-paypro-version': 2
      },
      method: 'post',
      strictSSL: true,
      url: `${bitpayUrl}/i/${invoiceId}`
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.data.toString())
        }
        return {
          headers: response.headers,
          rawBody: JSON.stringify(response.data)
        }
      })
      .catch((error) => {
        if (error) {
          throw new Error(error)
        }
      })

  const verifyPaymentRequest = (invoiceId, tx, weightedSize, chain) =>
    axios({
      data: {
        chain,
        transactions: [{ tx, weightedSize }]
      },
      headers: {
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0',
        'Content-Type': 'application/payment-verification',
        'x-paypro-version': 2
      },
      method: 'post',
      url: `${bitpayUrl}/i/${invoiceId}`
    })

  const submitPaymentRequest = (invoiceId, tx, weightedSize, chain) =>
    axios({
      data: {
        chain,
        transactions: [{ tx, weightedSize }]
      },
      headers: {
        BP_PARTNER: 'Blockchain',
        BP_PARTNER_VERSION: 'V6.28.0',
        'Content-Type': 'application/payment',
        'x-paypro-version': 2
      },
      method: 'post',
      url: `${bitpayUrl}/i/${invoiceId}`
    })

  return {
    getRawPaymentRequest,
    submitPaymentRequest,
    verifyPaymentRequest
  }
}
