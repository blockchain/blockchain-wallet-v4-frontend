import {
  Wallet, HDWallet, HDWalletList, HDAccountList, AddressMap,
  TXNotes, Address, HDAccount, AddressBook, AddressBookEntry
} from '../types'
import {
  prop, compose, curry, mapAccum, isNil, not, findIndex, view, allPass,
  propSatisfies, ifElse, always, propEq, propOr, find, over, lensProp, lensIndex, equals, toLower
} from 'ramda'
import memoize from 'fast-memoize'
import moment from 'moment'

const unpackInput = prop('prev_out')
const isLegacy = (wallet, coin) => compose(not, isNil, AddressMap.selectAddress(prop('addr', coin)), Wallet.selectAddresses)(wallet)
const isAccount = coin => !!coin.xpub
const isAccountChange = x => isAccount(x) && x.xpub.path.split('/')[1] === '1'
const accountPath = (index, coin) => index + coin.xpub.path.substr(1)
const receiveIndex = coin => {
  if (!coin || !coin.xpub || !coin.xpub.path) return
  if (!coin.xpub.path.split('/').length === 3) return
  return parseInt(coin.xpub.path.substr(1).split('/')[2])
}
const isCoinBase = (inputs) => (inputs.length === 1 && inputs[0].prev_out == null)

const tagCoin = curry((wallet, coin) => {
  switch (true) {
    case isLegacy(wallet, coin):
      const address = compose(AddressMap.selectAddress(coin.addr), Wallet.selectAddresses)(wallet)
      return {
        address: coin.addr,
        amount: coin.value,
        change: false,
        coinType: 'legacy',
        label: Address.selectLabel(address),
        isWatchOnly: Address.isWatchOnly(address)
      }
    case isAccount(coin):
      const account = compose(HDAccountList.selectByXpub(coin.xpub.m),
        HDWallet.selectAccounts,
        HDWalletList.selectHDWallet,
        Wallet.selectHdWallets)(wallet)
      const index = HDAccount.selectIndex(account)
      return {
        accountIndex: index,
        address: coin.addr,
        amount: coin.value,
        change: isAccountChange(coin),
        coinType: accountPath(index, coin),
        label: HDAccount.selectLabel(account),
        isWatchOnly: HDAccount.isWatchOnly(account),
        receiveIndex: receiveIndex(coin) // only if change?
      }
    default:
      const bookEntry = compose(AddressBook.selectAddressLabel(coin.addr), Wallet.selectAddressBook)(wallet)
      return {
        address: coin.addr,
        amount: coin.value,
        change: false,
        coinType: 'external',
        label: bookEntry ? AddressBookEntry.selectLabel(bookEntry) : null,
        isWatchOnly: false
      }
  }
})

const txtype = (result, fee) => {
  const impact = result + fee
  switch (true) {
    case impact === 0: return 'Transferred'
    case result < 0: return 'Sent'
    case result > 0: return 'Received'
    default: return 'Unknown'
  }
}

// amount is what we show on the transaction feed
// result is internalreceive - internalspend
const computeAmount = (type, inputData, outputData) => {
  switch (type) {
    case 'Transferred': return propOr(0, 'internal', outputData) - propOr(0, 'change', outputData)
    case 'Sent': return -propOr(0, 'internal', outputData) + propOr(0, 'internal', inputData)
    case 'Received': return propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
    default: return propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
  }
}

const init = {
  total: 0,
  internal: 0,
  isWatchOnly: false,
  change: 0
}

// internalAmount :: taggedCoin -> Integer
const internalAmount = ifElse(
  propSatisfies(x => x !== 'external', 'coinType'),
  prop('amount'),
  always(0)
)

const changeAmount = ifElse(
  propEq('change', true),
  prop('amount'),
  always(0)
)

const reduceCoins = (acc, taggedCoin) => {
  return {
    total: acc.total + taggedCoin.amount,
    internal: acc.internal + internalAmount(taggedCoin),
    isWatchOnly: acc.isWatchOnly || taggedCoin.isWatchOnly,
    change: acc.change + changeAmount(taggedCoin)
  }
}

var appender = curry((tagger, acc, coin) => {
  const taggedCoin = tagger(coin)
  return [reduceCoins(acc, taggedCoin), taggedCoin]
})

const selectFromAndto = (inputs, outputs, type) => {
  const preceived = compose(not, propEq('coinType', 'external'))
  const psent = compose(not, propEq('address', inputs[0].address))
  const predicate = type === 'Sent' ? psent : preceived
  const myOutput = find(
    allPass([propEq('change', false), predicate])
  )(outputs) || outputs[0]
  return {
    from: inputs[0].label || inputs[0].address,
    to: myOutput.label || myOutput.address
  }
}

const findLegacyChanges = (inputs, inputData, outputs, outputData) => {
  if (inputs && inputs[0].coinType === 'legacy' && inputData.internal === inputData.total) {
    const address = inputs[0].address
    const index = findIndex(propEq('address', address))(outputs)
    if (index < 0) return [outputData, outputs] // no change
    const newOutputs = over(compose(lensIndex(index), lensProp('change')), not, outputs)
    const change = view(compose(lensIndex(index), lensProp('amount')), outputs)
    const newOutputData = over(lensProp('change'), c => c + change, outputData)
    return [newOutputData, newOutputs]
  } else {
    return [outputData, outputs]
  }
}

const CoinbaseCoin = total => ({
  address: 'Coinbase',
  amount: total,
  change: false,
  coinType: 'external',
  label: 'Coinbase',
  isWatchOnly: false
})

const CoinBaseData = total => ({
  total: total,
  internal: 0,
  isWatchOnly: false,
  change: 0
})

export const getTime = tx => {
  const date = moment.unix(tx.time).local()
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

export const _transformTx = (wallet, currentBlockHeight, tx) => {
  const txNotes = Wallet.selectTxNotes(wallet)
  const conf = currentBlockHeight - tx.block_height + 1
  const confirmations = conf > 0 ? conf : 0
  const type = txtype(tx.result, tx.fee)
  const inputTagger = compose(tagCoin(wallet), unpackInput)
  const outputTagger = tagCoin(wallet)
  const [oData, outs] = mapAccum(appender(outputTagger), init, prop('out', tx))
  const [inputData, inputs] = ifElse(
    compose(isCoinBase, prop('inputs')),
    always([CoinBaseData(oData.total), [CoinbaseCoin(oData.total)]]),
    t => mapAccum(appender(inputTagger), init, prop('inputs', t))
  )(tx)
  const [outputData, outputs] = findLegacyChanges(inputs, inputData, outs, oData)
  const { from, to } = selectFromAndto(inputs, outputs, type)

  return ({
    double_spend: tx.double_spend,
    hash: tx.hash,
    amount: computeAmount(type, inputData, outputData),
    type: toLower(type),
    description: TXNotes.selectNote(tx.hash, txNotes) || '',
    time: tx.time,
    timeFormatted: getTime(tx),
    fee: tx.fee,
    confirmations: confirmations,
    inputs: inputs,
    outputs: outputs,
    fromWatchOnly: inputData.isWatchOnly,
    toWatchOnly: outputData.isWatchOnly,
    from,
    to
  })
}

export const transformTx = memoize(_transformTx)
