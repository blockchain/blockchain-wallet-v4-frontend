import {
  any,
  curry,
  equals,
  filter,
  head,
  includes,
  lift,
  map,
  path,
  prop,
  toLower
} from 'ramda'
import { calculateFee } from 'blockchain-wallet-v4/src/utils/eth'
import { EthProcessedTxType, TransferType } from './types'
import {
  getDefaultAddress,
  getDefaultLabel,
  getErc20Accounts,
  getErc20TxNote,
  getEthTxNote
} from '../redux/kvStore/eth/selectors'
import { getLockboxEthAccounts } from '../redux/kvStore/lockbox/selectors'
import { RawErc20TxType, RawEthTxType } from 'core/network/api/eth/types'
import { RootState } from 'data/rootReducer'
import moment from 'moment'
import Remote from '../remote'

//
// Shared Utils
//
export const getTime = timeStamp => {
  const date = moment.unix(timeStamp).local()
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)

  switch (true) {
    case includes(tx.from, lowerAddresses) && includes(tx.to, lowerAddresses):
      return 'Transferred'
    case includes(tx.from, lowerAddresses):
      return 'Sent'
    case includes(tx.to, lowerAddresses):
      return 'Received'
    default:
      return 'Unknown'
  }
}

//
// ETH
//

export const getLabel = (address, state) => {
  const defaultLabelR = getDefaultLabel(state)
  const defaultAddressR = getDefaultAddress(state)
  const lockboxEthAccountsR = getLockboxEthAccounts(state)
  const transform = (defaultLabel, defaultAddress, lockboxEthAccounts) => {
    switch (true) {
      case equals(toLower(defaultAddress), toLower(address)):
        return defaultLabel
      case any(
        // @ts-ignore
        x => equals(toLower(x.addr), toLower(address)),
        lockboxEthAccounts
      ):
        const ethAccounts = filter(
          // @ts-ignore
          x => equals(toLower(x.addr), toLower(address)),
          lockboxEthAccounts
        )
        // @ts-ignore
        return prop('label', head(ethAccounts))
      default:
        return address
    }
  }
  const labelR = lift(transform)(
    defaultLabelR,
    defaultAddressR,
    lockboxEthAccountsR
  )
  return labelR.getOrElse(address)
}

export const _transformTx = curry(
  (
    addresses,
    erc20Contracts,
    state: RootState,
    tx: RawEthTxType
  ): EthProcessedTxType => {
    const fee = calculateFee(
      tx.gasPrice,
      tx.state === 'CONFIRMED' ? tx.gasUsed : tx.gasLimit,
      false
    )
    const type: TransferType = toLower(getType(tx, addresses)) as TransferType
    const amount =
      type === 'sent' ? parseInt(tx.value) + parseInt(fee) : parseInt(tx.value)
    // @ts-ignore
    const time = tx.timestamp || tx.timeStamp
    const isErc20 = includes(tx.to, erc20Contracts.map(toLower))

    return {
      amount,
      coin: 'ETH',
      blockHeight: tx.state === 'CONFIRMED' ? tx.blockNumber : undefined,
      data: isErc20 ? tx.data : undefined,
      description: getEthTxNote(state, tx.hash).getOrElse(''),
      erc20: isErc20,
      fee: Remote.Success(fee),
      from: getLabel(tx.from, state),
      hash: tx.hash,
      insertedAt: Number(time) * 1000,
      state: tx.state,
      time,
      timeFormatted: getTime(time),
      to: getLabel(tx.to, state),
      type
    }
  }
)

//
// ERC20
//
export const getErc20Label = (address, token, state: RootState) => {
  const erc20AccountsR = getErc20Accounts(state)
  const ethAddressR = getDefaultAddress(state)
  const transform = (ethAddress, erc20Accounts) => {
    if (equals(toLower(ethAddress), toLower(address))) {
      return path([token, 'label'], erc20Accounts)
    }
    return address
  }
  const labelR = lift(transform)(ethAddressR, erc20AccountsR)
  return labelR.getOrElse(address)
}

export const _transformErc20Tx = curry(
  (
    addresses,
    state: RootState,
    token,
    tx: RawErc20TxType
  ): EthProcessedTxType => {
    const type = toLower(getType(tx, addresses)) as TransferType
    const time = tx.timestamp || tx.timeStamp

    return {
      amount: parseInt(tx.value),
      coin: token,
      blockHeight: tx.blockNumber,
      description: getErc20TxNote(state, token, tx.transactionHash).getOrElse(
        ''
      ),
      erc20: false,
      fee: Remote.NotAsked,
      from: getErc20Label(tx.from, token, state),
      hash: tx.transactionHash,
      insertedAt: Number(time) * 1000,
      time,
      timeFormatted: getTime(time),
      to: getErc20Label(tx.to, token, state),
      type
    }
  }
)

export const transformTx = _transformTx
export const transformErc20Tx = _transformErc20Tx
