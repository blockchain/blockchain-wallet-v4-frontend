import * as services from './services'

describe(`showResult`, () => {
  it(`should return false when all inputs are empty`, () => {
    expect(
      services.showResult({ address: ``, message: ``, signature: `` })
    ).toEqual(false)
  })

  it(`should return false when some inputs are empty`, () => {
    expect(
      services.showResult({
        address: `address`,
        message: `message`,
        signature: ``
      })
    ).toEqual(false)
  })

  it(`return true when all inputs are provided`, () => {
    expect(
      services.showResult({
        address: `address`,
        message: `message`,
        signature: `signature`
      })
    ).toEqual(true)
  })
})

describe(`verifySignature`, () => {
  it(`good signature`, () => {
    expect(
      services.verifySignature({
        address: `15WJg3bnKkuzeLxCKUGCKjRM42d3LgWg9u`,
        message: `Fun is nuf spelled backwards!`,
        signature: `HxB1FMYnYLda3SDhFVXpfyUfxfGOUOuCkrY0rwxIFaXzWgv/y7Wlijd9C/2t6ydoVOpi4v5XedgvDDOb8a6ZCfo=`
      })
    ).toEqual(true)
  })

  it(`bad signature`, () => {
    expect(
      services.verifySignature({
        address: `15WJg3bnKkuzeLxCKUGCKjRM42d3LgWg9u`,
        message: `Fun is nuf spelled backwards!`,
        signature: `bad signature`
      })
    ).toEqual(false)
  })
})
