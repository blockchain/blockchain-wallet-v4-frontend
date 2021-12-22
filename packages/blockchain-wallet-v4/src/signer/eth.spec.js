import { ethers } from 'ethers'

import { sign, signErc20 } from './eth.js'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

const mnemonic = 'frozen frame material evolve pill sing horn life spend amateur chat amused'
const mockDepositAddress = '0xC5C4c5b3fAC134fc8b74Ad0e161fc781aC7aC010'
const mockHotWalletAddress = '0xD5e3614010188A098104944a30e5508A11D13a36'
const provider = ethers.getDefaultProvider()
const baselineWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0")
const mockErc20Address = '0x6b175474e89094c44da98b954eedeac495271d0f'
const nonce = 0
describe('Signing ETH transactions', () => {
  it('Should sign an Ethereum transaction correctly without a depositAddress', async () => {
    const baselineSignedTx = await baselineWallet.signTransaction({
      chainId: 1,
      gasLimit: 400_000,
      gasPrice: 1,
      nonce,
      to: mockDepositAddress,
      value: ethers.utils.parseEther('0.1')
    })
    const testSignedTxTask = sign(1, mnemonic, {
      amount: ethers.utils.parseEther('0.1'),
      gasLimit: 400_000,
      gasPrice: 1,
      index: 0,
      nonce,
      to: mockDepositAddress
    })
    const testSignedTx = await taskToPromise(testSignedTxTask)
    expect(testSignedTx).toEqual(baselineSignedTx)
  })
  it('Should sign an Ethereum transaction correctly with a depositAddress', async () => {
    const baselineSignedTx = await baselineWallet.signTransaction({
      chainId: 1,
      data: mockDepositAddress,
      gasLimit: 400_600,
      gasPrice: 1,
      nonce,
      to: mockHotWalletAddress,
      value: ethers.utils.parseEther('0.1')
    })

    const testSignedTxTask = sign(1, mnemonic, {
      amount: ethers.utils.parseEther('0.1'),
      depositAddress: mockDepositAddress,
      gasLimit: 400_000,
      gasPrice: 1,
      index: 0,
      nonce,
      to: mockHotWalletAddress
    })
    const testSignedTx = await taskToPromise(testSignedTxTask)
    expect(testSignedTx).toEqual(baselineSignedTx)
  })
})
describe('Signing ERC20 transactions', () => {
  it('Should sign an ERC20 transaction correctly without a depositAddress', async () => {
    const baselineSignedTx = await baselineWallet.signTransaction({
      chainId: 1,
      data: `0xa9059cbb${ethers.utils.defaultAbiCoder
        .encode(['address', 'uint256'], [mockDepositAddress, ethers.utils.parseEther('0.1')])
        .replace('0x', '')}`,
      gasLimit: 400_000,
      gasPrice: 1,
      nonce,
      to: mockErc20Address,
      value: 0
    })
    const testSignedTxTask = signErc20(
      1,
      mnemonic,
      {
        amount: ethers.utils.parseEther('0.1').toString(),
        gasLimit: 400_000,
        gasPrice: 1,
        index: 0,
        nonce,
        to: mockDepositAddress
      },
      mockErc20Address
    )
    const testSignedTx = await taskToPromise(testSignedTxTask)
    expect(testSignedTx).toEqual(baselineSignedTx)
  })
  it('Should sign an ERC20 transaction correctly with a depositAddress', async () => {
    const baselineSignedTx = await baselineWallet.signTransaction({
      chainId: 1,
      data: `0xa9059cbb${ethers.utils.defaultAbiCoder
        .encode(['address', 'uint256'], [mockHotWalletAddress, ethers.utils.parseEther('0.1')])
        .replace('0x', '')}${mockDepositAddress.substring(2)}`,
      gasLimit: 400_600,
      gasPrice: 1,
      nonce,
      to: mockErc20Address,
      value: 0
    })
    const testSignedTxTask = signErc20(
      1,
      mnemonic,
      {
        amount: ethers.utils.parseEther('0.1').toString(),
        depositAddress: mockDepositAddress,
        gasLimit: 400_000,
        gasPrice: 1,
        index: 0,
        nonce,
        to: mockHotWalletAddress
      },
      mockErc20Address
    )
    const testSignedTx = await taskToPromise(testSignedTxTask)
    expect(testSignedTx).toEqual(baselineSignedTx)
  })
})
