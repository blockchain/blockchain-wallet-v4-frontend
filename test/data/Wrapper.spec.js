import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import { Wrapper, serializer } from '../../src/types'
chai.use(chaiImmutable)
const { expect } = chai

const wrapperFixture = require('../_fixtures/Wrapper/wrapper.v3')
// const wrapperFixture = require('../_fixtures/wallet.v3')
// const walletNewFixture = require('../_fixtures/wallet-new.v3')
// const walletFixtureSecpass = require('../_fixtures/wallet.v3-secpass')

// TODO :: ADD MISSING TYPES FOR TX-NOTES ETC
describe('serializer', () => {
  const myWrapper = Wrapper.fromJS(wrapperFixture)
  it('compose(reviver, replacer) should be identity', () => {
    const string = JSON.stringify(myWrapper)
    const newWrapper = JSON.parse(string, serializer.reviver)
    expect(newWrapper).to.deep.equal(myWrapper)
  })
  it('compose(replacer, reviver) should be identity', () => {
    const string = JSON.stringify(myWrapper)
    const newWrapper = JSON.parse(string, serializer.reviver)
    const string2 = JSON.stringify(newWrapper)
    expect(string2).to.equal(string)
  })
})
