import { HDNode } from 'bitcoinjs-lib'

import { changeChain, fromJS, getAddress, receiveChain } from './Cache'

jest.mock('bitcoinjs-lib', () => ({
  HDNode: {
    fromBase58: jest.fn()
  }
}))

const deriveMock = jest.fn(() => ({
  getAddress: jest.fn(() => 'addr')
}))

const { fromBase58 } = HDNode
fromBase58.mockReturnValue({
  derive: deriveMock
})

describe('getAddress', () => {
  const receiveAccount = '123'
  const changeAccount = '456'
  const cache = fromJS({
    receiveAccount,
    changeAccount
  })
  const network = 'network'
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should memoize node selection', () => {
    expect(fromBase58).toHaveBeenCalledTimes(0)
    getAddress(cache, changeChain, 0, network)
    expect(fromBase58).toHaveBeenCalledTimes(1)
    getAddress(cache, changeChain, 0, network)
    expect(fromBase58).toHaveBeenCalledTimes(1)
    getAddress(cache, changeChain, 1, network)
    expect(fromBase58).toHaveBeenCalledTimes(1)
    getAddress(cache, receiveChain, 1, network)
    expect(fromBase58).toHaveBeenCalledTimes(2)
  })

  it('should memoize address derivation', () => {
    expect(deriveMock).toHaveBeenCalledTimes(0)
    getAddress(cache, changeChain, 2, network)
    expect(deriveMock).toHaveBeenCalledTimes(1)
    getAddress(cache, changeChain, 2, network)
    expect(deriveMock).toHaveBeenCalledTimes(1)
    getAddress(cache, changeChain, 3, network)
    expect(deriveMock).toHaveBeenCalledTimes(2)
  })
})
