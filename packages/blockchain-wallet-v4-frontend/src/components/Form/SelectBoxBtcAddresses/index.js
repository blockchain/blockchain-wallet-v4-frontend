import React from 'react'
import { connect } from 'react-redux'
import { concat } from 'ramda'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxBitcoin from './template'

class SelectBoxBitcoinAddresses extends React.PureComponent {
  getLabel () {
    return this.props.optional ? 'N/A' : `All Bitcoin Wallets`
  }
  concatAll () {
    return concat([
      { group: '', items: [{ value: 'all', text: this.getLabel() }] }
    ])
  }
  render () {
    const { data, includeAll, ...rest } = this.props

    return data.cata({
      Success: value => {
        const wallets = [
          {
            group: '',
            items: value.data
          }
        ]
        const elements = includeAll ? this.concatAll()(wallets) : wallets
        return (
          <SelectBoxBitcoin
            label={this.getLabel()}
            elements={elements}
            {...rest}
          />
        )
      },
      Failure: message => <div>{message}</div>,
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
