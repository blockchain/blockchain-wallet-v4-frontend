import { networks } from 'bitcoinjs-lib'
import { map, range } from 'ramda'

import Remote from '../../remote'
import { getReceiveAddress } from '../../types/HDAccount'
import { getReceiveIndex } from '../data/btc/selectors'
import { getAccountXpub } from '../wallet/selectors'
import {
  addressLookaheadCount,
  getHDAccountAddressPromises
} from './middleware'

jest.mock('../wallet/selectors')
jest.mock('../data/btc/selectors')
jest.mock('../../types/HDAccount')

jest.useFakeTimers()

/**
 * getHDAccountAddressPromises mocks
 */

describe('getHDAccountAddressPromises', () => {
  const state = {}
  const account = {
    index: 'index'
  }
  const receiveIndex = 5
  const xpub = '1234'
  const mockDerivation = (account, index, network) =>
    `${account.index}${index}${network}`
  getAccountXpub.mockReturnValue(xpub)
  getReceiveIndex.mockReturnValue(Remote.of(receiveIndex))
  getReceiveAddress.mockImplementation(mockDerivation)

  beforeEach(() => {
    jest.runAllTimers()
    jest.clearAllMocks()
  })

  it('should select xpub', () => {
    getHDAccountAddressPromises(state, account)

    expect(getAccountXpub).toHaveBeenCalledTimes(1)
    expect(getAccountXpub).toHaveBeenCalledWith(account.index, state)
  })

  it('should select receiveIndex', () => {
    getHDAccountAddressPromises(state, account)

    expect(getReceiveIndex).toHaveBeenCalledTimes(1)
    expect(getReceiveIndex).toHaveBeenCalledWith(xpub, state)
  })

  it(`should call getRecieveAddress ${addressLookaheadCount} times
      with indexes from range (max(receiveIndex, receiveIndex + ${addressLookaheadCount})`, () => {
    getHDAccountAddressPromises(state, account)
    jest.runAllTimers()

    expect(getReceiveAddress).toHaveBeenCalledTimes(addressLookaheadCount)
    expect(getReceiveAddress.mock.calls).toEqual(
      map(
        index => [account, index, networks.bitcoin.NETWORK_BTC],
        range(receiveIndex, receiveIndex + addressLookaheadCount)
      )
    )
  })

  it('should return array of Promises resolving with getReceiveAddress values', async () => {
    const expectedResult = map(
      index => mockDerivation(account, index, networks.bitcoin.NETWORK_BTC),
      range(receiveIndex, receiveIndex + addressLookaheadCount)
    )

    const promise = Promise.all(
      getHDAccountAddressPromises(state, account)
    ).then(result => expect(result).toEqual(expectedResult))

    jest.runAllTimers()

    return promise
  })
})
