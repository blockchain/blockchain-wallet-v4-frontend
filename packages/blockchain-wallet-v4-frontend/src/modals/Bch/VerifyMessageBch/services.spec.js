import * as services from './services'

describe('showResult', () => {
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
})

describe(`verifySignature`, () => {
  it(`good signature`, () => {
    expect(
      services.verifySignature({
        address: `qz6ry5kfdwwpgfq5mvlmrl8gu7rg5pu5f5mgdy7rxf`,
        message: `otomakan ihsotas si thgirw giarc`,
        signature: `H/yibU+CSFl+964VwQXRjNgxdNqcrtwqK9o3uxmDGsKoExNoOJHfh5DSzV7WfLPjd1Cbhma3g2nVXIEYQM35hPc=`
      })
    ).toEqual(true)
  })

  it(`bad signature`, () => {
    expect(
      services.verifySignature({
        address: `qz6ry5kfdwwpgfq5mvlmrl8gu7rg5pu5f5mgdy7rxf`,
        message: `Fun is nuf spelled backwards!`,
        signature: `bad signature`
      })
    ).toEqual(false)
  })
})
