import * as Bitcoin from 'bitcoinjs-lib'

import { serializer, Wrapper } from './index'

const wrapperFixture = require('./__mocks__/wrapper.v4')
const wrapperFixtureV4Segwit = require('./__mocks__/wrapper.v4-segwit')
const wrapperFixtureV3 = require('./__mocks__/wrapper.v3')
const wrapperFixtureV2 = require('./__mocks__/wrapper.v2')

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

describe('Wrapper', () => {
  const wrapper = Wrapper.fromJS(wrapperFixture)
  const wrapperV4Segwit = Wrapper.fromJS(wrapperFixtureV4Segwit)
  const wrapperV3 = Wrapper.fromJS(wrapperFixtureV3)
  const wrapperV2 = Wrapper.fromJS(wrapperFixtureV2)

  describe('serializer', () => {
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(wrapper)
      const newWrapper = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newWrapper)
      expect(string2).toEqual(string)
    })
  })

  describe('upgradeToV4', () => {
    it('should upgrade to a v4 wallet with segwit', async () => {
      const upgradeTask = Wrapper.upgradeToV4(
        '6a4d9524d413fdf69ca1b5664d1d6db0',
        null,
        Bitcoin.networks.bitcoin,
        wrapperV3
      )
      const upgraded = await taskToPromise(upgradeTask)
      const stringifiedUpgraded = JSON.stringify(upgraded.toJSON())
      const stringifiedSegwitWrapper = JSON.stringify(wrapperV4Segwit.toJSON())
      expect(stringifiedUpgraded).toEqual(stringifiedSegwitWrapper)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
