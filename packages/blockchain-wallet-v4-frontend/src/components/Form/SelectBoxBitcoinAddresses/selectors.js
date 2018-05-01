import React from 'react'
import { FormattedMessage } from 'react-intl'
import { assoc, assocPath, compose, concat, identity, lift, map, path, prop, sequence } from 'ramda'
import { Banner, Text } from 'blockchain-info-components'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, coin) => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const formatAddressesData = (addressesData) => addressesData.map(a => a.data.map(d => {
  d.text = <Text weight={300} size='12px'>
            {d.text} ({Exchange.displayCoinToCoin({ value: d.value.balance, coin: d.value.coin, baseToStandard: true })})
            {path(['value', 'watchOnly'], d) 
              && <Banner type='informational' inline>
                  <FormattedMessage id='components.selectboxbitcoin.watchonly' defaultMessage='Watch Only'/>
                </Banner>}
          </Text> }))

  const formatAddress = (addressData) => {
    const formattedAddress = {}
    return compose(
      a => assoc('text', prop('addr', addressData), a),
      a => assocPath(['value', 'balance'], path(['info', 'final_balance'], addressData), a),
      a => assocPath(['value', 'coin'], coin, a),
      a => assoc('value', prop('info', addressData), a)
    )(formattedAddress)
  }

  const formatImportedAddressesData = (addressesData) => {
    return map(formatAddress, addressesData)
  }

  const getAddressesData = (coin) => {
    switch (coin) {
      case 'BCH':
        const importedAddresses = selectors.core.common.bch.getActiveAddresses(state)
        return sequence(Remote.of,
          [
            selectors.core.common.bch.getAccountsBalances(state).map(toDropdown),
            lift(formatImportedAddressesData)(importedAddresses)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
      default:
        return sequence(Remote.of,
          [
            selectors.core.common.bitcoin.getActiveAccountsBalances(state).map(toDropdown),
            selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
    }
  }

  const addressesData = getAddressesData(coin)
  formatAddressesData(addressesData)

  return addressesData
}
