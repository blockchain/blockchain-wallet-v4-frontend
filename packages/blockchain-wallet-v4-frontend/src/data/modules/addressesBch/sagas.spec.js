import addressesBchSagas from './sagas'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { createMockState, walletV3 } from 'blockchain-wallet-v4/data'
import Bitcoin from 'bitcoinjs-lib'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()
const networks = { btc: Bitcoin.networks.bitcoin }

describe('addressesBchSagas', () => {
  describe('select bch change addresses', () => {
    let { selectChangeAddresses } = addressesBchSagas({
      coreSagas,
      networks
    })

    let mockState = createMockState(walletV3)

    it('should select the minimum amount of change addresses', () => {
      expect(selectChangeAddresses(0, 1, 100, mockState)).toEqual([
        '16vfr1dUmmRU2YtYhUJbqWjXazeDzVw6aw',
        '15gHoLzttW6PNigJgy3wY3A96gTXpUEok6',
        '1z3v2dk9X9BqhfGmhx7pue9YuHc8KZpqS',
        '15ksB359KR8NbxbkEfhJwjWGwP5Fn4iSrn'
      ])
    })
  })
})
