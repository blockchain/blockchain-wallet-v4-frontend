import { bchTx, createMockWalletState, walletV3 } from '../../data'
import { Types } from '../../src'
import { _transformTx } from './bch'

describe('transformTx', () => {
  const mockState = createMockWalletState(walletV3)
  const tx = _transformTx(
    mockState.walletPath.wallet,
    558418,
    Types.HDAccountList.fromJS([]),
    bchTx
  )

  it('should not include dust transactions', () => {
    expect(tx.inputs.length).toBe(1)
    expect(tx.outputs.length).toBe(2)
  })
})
