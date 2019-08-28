import addressesBchSagas from './sagas'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { createMockWalletState, walletV3 } from 'blockchain-wallet-v4/data'
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

    let mockState = createMockWalletState(walletV3)

    it('should select the minimum amount of change addresses', () => {
      expect(selectChangeAddresses(0, 1, 100, mockState)).toEqual([
        '1L75h2D5z87XZzTPDtPGrS4GJvzzMZNuaY',
        '1CP3QZDLqEzkQywYAqZBeva1ZUGJJ78wRq',
        '1DBgG8PEugdbenZUMkhE1GgU1YrXEWJCYf',
        '18wpL2Aj4gFJv29Gjwr2v6n4AQ5ZLvySRB'
      ])
    })
  })
})
