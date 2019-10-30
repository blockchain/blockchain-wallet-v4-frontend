import { getAddress, fromJS, receiveChain, changeChain } from './Cache'
import { bip32, payments } from 'bitcoinjs-lib'

jest.mock('bitcoinjs-lib', () => ({
  bip32: {
    fromBase58: jest.fn()
  },
  payments: {
    p2pkh: jest.fn()
  }
}))

const deriveMock = jest.fn(() => ({
  getAddress: jest.fn(() => 'addr')
}))

const { fromBase58 } = bip32
fromBase58.mockReturnValue({
  derive: deriveMock
})

const { p2pkh } = payments
p2pkh.mockReturnValue({
  derive: jest.fn(() => ({
    address: jest.fn(() => 'addr')
  }))
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
    expect(deriveMock).toHaveBeenCalledTimes(2)
    getAddress(cache, changeChain, 3, network)
    expect(deriveMock).toHaveBeenCalledTimes(3)
  })
})
