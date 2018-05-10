import React from 'react'
import { connect } from 'react-redux'
import { concat } from 'ramda'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxBitcoin from './template'

class SelectBoxBitcoinAddresses extends React.PureComponent {
  getLabel (coin) {
    return this.props.optional ? 'N/A' : `All Bitcoin${coin === 'BCH' ? ' Cash' : ''} Wallets`
  }
  concatAll (coin) {
    return concat([{ group: '', items: [{ value: 'all', text: this.getLabel(coin) }] }])
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
        return <SelectBoxBitcoin label={this.getLabel(coin)} elements={elements} {...rest} />
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
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBitcoinAddresses)
