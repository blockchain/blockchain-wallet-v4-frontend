import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'ramda'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinAddresses extends React.PureComponent {
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
    const { data, coin, includeAll, ...rest } = this.props

    return data.cata({
      Success: (value) => {
        const wallets = [{
          group: '',
          items: value.data
        }]
        const elements = includeAll ? this.concatAll(coin)(wallets) : wallets

        return <SelectBox elements={elements} {...rest} />
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

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

export default connect(mapStateToProps)(SelectBoxBitcoinAddresses)
