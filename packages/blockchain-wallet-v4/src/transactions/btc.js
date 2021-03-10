import moment from 'moment'
import {
  allPass,
  always,
  compose,
  curry,
  equals,
  find,
  findIndex,
  ifElse,
  isNil,
  lensIndex,
  lensProp,
  mapAccum,
  not,
  over,
  prop,
  propEq,
  propOr,
  propSatisfies,
  toLower,
  view
} from 'ramda'

import Remote from '../remote'
import {
  Address,
  AddressBook,
  AddressBookEntry,
  AddressMap,
  HDAccount,
  HDAccountList,
  HDWallet,
  HDWalletList,
  TXNotes,
  Wallet
} from '../types'

const unpackInput = prop('prev_out')
const isLegacy = (wallet, coin) =>
  compose(
    not,
    isNil,
    AddressMap.selectAddress(prop('addr', coin)),
    Wallet.selectAddresses
  )(wallet)
const isAccount = coin => !!coin.xpub
const isAccountChange = x => isAccount(x) && x.xpub.path.split('/')[1] === '1'
const accountPath = (index, coin) => index + coin.xpub.path.substr(1)
const receiveIndex = coin => {
  if (!coin || !coin.xpub || !coin.xpub.path) return
  if (!coin.xpub.path.split('/').length === 3) return
  return parseInt(coin.xpub.path.substr(1).split('/')[2])
}
const isCoinBase = inputs => inputs.length === 1 && inputs[0].prev_out == null

const tagCoin = curry((wallet, accountList, coin) => {
  switch (true) {
    case isAccount(coin):
      const account =
        compose(
          HDAccountList.selectByXpub(coin.xpub.m),
          HDWallet.selectAccounts,
          HDWalletList.selectHDWallet,
          Wallet.selectHdWallets
        )(wallet) ||
        compose(HDAccountList.selectByXpub(coin.xpub.m))(accountList)
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
    case isLegacy(wallet, coin):
      const address = compose(
        AddressMap.selectAddress(coin.addr),
        Wallet.selectAddresses
      )(wallet)
      return {
        address: coin.addr,
        amount: coin.value,
        change: false,
        coinType: 'legacy',
        label: Address.selectLabel(address),
        isWatchOnly: Address.isWatchOnly(address)
      }
    default:
      const bookEntry = compose(
        AddressBook.selectAddressLabel(coin.addr),
        Wallet.selectAddressBook
      )(wallet)
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
    case impact === 0:
      return 'Transferred'
    case result < 0:
      return 'Sent'
    case result > 0:
      return 'Received'
    default:
      return 'Unknown'
  }
}

// amount is what we show on the transaction feed
// result is internalreceive - internalspend
const computeAmount = (type, inputData, outputData) => {
  switch (type) {
    case 'Transferred':
      return propOr(0, 'internal', outputData) - propOr(0, 'change', outputData)
    case 'Sent':
      return (
        -propOr(0, 'internal', outputData) + propOr(0, 'internal', inputData)
      )
    case 'Received':
      return (
        propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
      )
    default:
      return (
        propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
      )
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

const changeAmount = ifElse(propEq('change', true), prop('amount'), always(0))

const reduceCoins = (acc, taggedCoin) => {
  return {
    total: acc.total + taggedCoin.amount,
    internal: acc.internal + internalAmount(taggedCoin),
    isWatchOnly: acc.isWatchOnly || taggedCoin.isWatchOnly,
    change: acc.change + changeAmount(taggedCoin)
  }
}

let appender = curry((tagger, acc, coin) => {
  const taggedCoin = tagger(coin)
  return [reduceCoins(acc, taggedCoin), taggedCoin]
})

const selectFromAndto = (inputs, outputs, type) => {
  const preceived = compose(not, propEq('coinType', 'external'))
  const psent = compose(not, propEq('address', inputs[0].address))
  const predicate = type === 'Sent' ? psent : preceived
  const myOutput =
    find(allPass([propEq('change', false), predicate]))(outputs) || outputs[0]
  return {
    from: inputs[0].label || inputs[0].address,
    to: myOutput.label || myOutput.address,
    toAddress: myOutput.address
  }
}

const findLegacyChanges = (inputs, inputData, outputs, outputData) => {
  if (
    inputs &&
    inputs[0].coinType === 'legacy' &&
    inputData.internal === inputData.total
  ) {
    const address = inputs[0].address
    const index = findIndex(propEq('address', address))(outputs)
    if (index < 0) return [outputData, outputs] // no change
    const newOutputs = over(
      compose(lensIndex(index), lensProp('change')),
      not,
      outputs
    )
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

const getDescription = (hash, txNotes, addressLabels, toAddress) => {
  let txNote = TXNotes.selectNote(hash, txNotes)
  return txNote || propOr('', [toAddress], addressLabels)
}

export const getTime = tx => {
  const date = moment.unix(tx.time).local()
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

export const _transformTx = (
  wallet,
  accountList,
  txNotes,
  addressLabels,
  tx
) => {
  const type = txtype(tx.result, tx.fee)
  const inputTagger = compose(tagCoin(wallet, accountList), unpackInput)
  const outputTagger = tagCoin(wallet, accountList)
  const [oData, outs] = mapAccum(appender(outputTagger), init, prop('out', tx))
  const [inputData, inputs] = ifElse(
    compose(isCoinBase, prop('inputs')),
    always([CoinBaseData(oData.total), [CoinbaseCoin(oData.total)]]),
    t => mapAccum(appender(inputTagger), init, prop('inputs', t))
  )(tx)

  const [outputData, outputs] = findLegacyChanges(
    inputs,
    inputData,
    outs,
    oData
  )
  const { from, to, toAddress } = selectFromAndto(inputs, outputs, type)

  return {
    amount: computeAmount(type, inputData, outputData),
    blockHeight: tx.block_height,
    coin: 'BTC',
    description: getDescription(tx.hash, txNotes, addressLabels, toAddress),
    double_spend: tx.double_spend,
    fee: Remote.Success(tx.fee),
    from,
    fromWatchOnly: inputData.isWatchOnly,
    hash: tx.hash,
    inputs: inputs,
    insertedAt: tx.time * 1000,
    outputs: outputs,
    rbf: tx.rbf,
    time: tx.time,
    timeFormatted: getTime(tx),
    to,
    toAddress,
    toWatchOnly: outputData.isWatchOnly,
    type: toLower(type)
  }
}

export const transformTx = _transformTx
