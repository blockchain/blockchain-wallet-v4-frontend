import MockWalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import Remote from '../../remote'
import { getInvitations } from '../settings/selectors'
import * as selectors from './selectors'

jest.mock('../settings/selectors')
// @ts-ignore
getInvitations.mockReturnValue(Remote.of({}))

describe('walletOptions selectors', () => {
  const successState = {
    walletOptionsPath: Remote.Success(MockWalletOptions)
  }

  it('getBtcNetwork should return correct network', () => {
    expect(selectors.getBtcNetwork(successState)).toEqual(Remote.of('bitcoin'))
  })

  it('getEthTxFuse should return correct lastTxFuse', () => {
    expect(selectors.getEthTxFuse(successState)).toEqual(Remote.of(600))
  })
})
