import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'ramda'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinAddresses extends React.Component {
  // isFiatAvailable () {
  //   const { coin, country, currency, rates, bitcoinOptions } = this.props
  //   if (isNil(coin)) return false
  //   if (isNil(country)) return false
  //   if (isNil(currency)) return false
  //   if (isNil(bitcoinOptions)) return false
  //   if (!bitcoinOptions.availability.fiat) return false
  //   if (!equals(bitcoinOptions.countries, '*') && !contains(bitcoinOptions.countries, country)) return false
  //   // if (!equals(bitcoinOptions.states, '*') && equals(country, 'US') && !contains(bitcoinOptions.states, state)) return false
  //   if (isEmpty(rates)) return false
  //   return true
  // }
  componentWillMount () {

  }

  concatAll (coin) {
    return concat([{ group: '', items: [{ value: 'all', text: `My Bitcoin${coin === 'BCH' ? ' Cash' : ''} Wallets` }] }])
  }

  render () {
    const { data, coin, ...rest } = this.props

    return data.cata({
      Success: (value) => {
        const elements = [{
          group: '',
          items: value.data
        }]

        return <SelectBox elements={this.concatAll(coin)(elements)} {...rest} />
      },
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBitcoinAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBitcoinAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  // const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  // const unit = selectors.core.settings.getBtcUnit(state)
  // const currency = selectors.core.settings.getCurrency(state)
  // const rates = selectors.core.data.bitcoin.getRates(state)

  // const transformAddresses = items => map(item => {
  //   const { title, amount, ...rest } = item
  //   const display = coinDisplayed
  //     ? Exchange.displayBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit })
  //     : Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: currency, rates })

  //   return { text: `${title} (${display})`, value: rest }
  // }, items)

  // const accounts = transformAddresses(selectors.core.common.bitcoin.getAccountsBalances(state))
  // const legacyAddresses = transformAddresses(selectors.core.common.bitcoin.getAddressesBalances(state))

  // return {
  //   accounts,
  //   legacyAddresses,
  //   unit,
  //   currency,
  //   coinDisplayed
  // }
  return {
    data: getData(state, ownProps.coin)
  }
}

export default connect(mapStateToProps)(SelectBoxBitcoinAddresses)
