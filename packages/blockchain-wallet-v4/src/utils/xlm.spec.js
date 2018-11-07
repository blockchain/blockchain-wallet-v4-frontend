import { decodeXlmURI } from './xlm'

const PLAIN_ADDRESS = 'GC3MMSXBWHL6CPOAVERSJITX7BH76YU252WGLUOM5CJX3E7UCYZBTPJQ'
const MEMO = 'memo'
const MSG = 'note'
const AMOUNT = 10000000
const XLM_PAY_URI = `web+stellar:pay?destination=${PLAIN_ADDRESS}&memo=${MEMO}&msg=${MSG}&amount=${AMOUNT}`

describe('xlm uri decode', () => {
  it('should support plain address', () => {
    expect(decodeXlmURI(PLAIN_ADDRESS)).toEqual({ address: PLAIN_ADDRESS })
  })

  it('should decode xlm pay uri', () => {
    expect(decodeXlmURI(XLM_PAY_URI)).toEqual({
      address: PLAIN_ADDRESS,
      memo: MEMO,
      note: MSG,
      amount: AMOUNT.toString()
    })
  })
})
