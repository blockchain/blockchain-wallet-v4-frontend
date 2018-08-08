import React from 'react'
import { connect } from 'react-redux'
import { concat } from 'ramda'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxBCH from './template'

class SelectBoxBCHAddresses extends React.PureComponent {
  getLabel () {
    return this.props.optional ? 'N/A' : `All Bitcoin Cash Wallets`
  }
  concatAll (coin) {
    return concat([
      { group: '', items: [{ value: 'all', text: this.getLabel() }] }
    ])
  }
  render () {
    const { data, coin, includeAll, ...rest } = this.props

    return data.cata({
      Success: value => {
        const wallets = [
          {
            group: '',
            items: value.data
          }
        ]
        const elements = includeAll ? this.concatAll(coin)(wallets) : wallets
        return (
          <SelectBoxBCH label={this.getLabel()} elements={elements} {...rest} />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBCHAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBCHAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBCHAddresses)
