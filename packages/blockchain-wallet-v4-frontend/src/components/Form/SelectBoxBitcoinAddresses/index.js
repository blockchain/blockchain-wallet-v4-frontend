import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat, identity } from 'ramda'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinAddresses extends React.PureComponent {
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
