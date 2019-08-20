import { parsePaymentRequest } from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')

describe('bitpaySagas', () => {
  describe('parsePaymentRequest', () => {
    describe('invalid raw payment request hash', () => {
      let headers = {
        'content-length': '393',
        'content-type': 'application/payment-request; charset=utf-8',
        digest:
          'SHA-256=7ffe09a01d01b612326fe66947dcccb1fbc6d4584ba36f12d3a2cb8a081525f2'
      }
      let rawBody = {
        network: 'main',
        currency: 'BTC',
        requiredFeeRate: 32.724,
        outputs: [
          { amount: 15900, address: '1yxztfYhAEXHJx1FDdVV9pkAknnuqWo2s' }
        ],
        time: '2019-07-31T21:34:00.505Z',
        expires: '2019-07-31T21:49:00.505Z',
        memo:
          'Payment request for BitPay invoice 4MRAisBqpPx9Y8gf8zmfPq for merchant Blockchain',
        paymentUrl: 'https://bitpay.com/i/4MRAisBqpPx9Y8gf8zmfPq',
        paymentId: '4MRAisBqpPx9Y8gf8zmfPq'
      }
      rawBody = JSON.stringify(rawBody)
      let incorrectAction = { rawBody, headers }
      let incorrectHash = 'SHA-256=HASHINCORRECT123'
      incorrectAction.headers.digest = incorrectHash
      let incorrectHashOnly = 'HASHINCORRECT123'
      let correctHashOnly =
        '7ffe09a01d01b612326fe66947dcccb1fbc6d4584ba36f12d3a2cb8a081525f2'
      let expectedError = new Error(
        `Response body hash does not match digest header. Actual: ${correctHashOnly} Expected: ${incorrectHashOnly}`
      )
      const generator = parsePaymentRequest(incorrectAction)
      it('should throw an error', () => {
        expect(
          generator.next().value.payload.action.payload.message
        ).toStrictEqual(expectedError)
      })
    })
  })
})
