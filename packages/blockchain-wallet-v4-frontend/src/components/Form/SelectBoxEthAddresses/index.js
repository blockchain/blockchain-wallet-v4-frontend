import React from 'react'
import { connect } from 'react-redux'
import { concat } from 'ramda'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxEther from './template'

class SelectBoxEtherAddresses extends React.PureComponent {
  getLabel () {
    return this.props.optional ? 'N/A' : `All Ether Wallets`
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
          <SelectBoxEther
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

SelectBoxEtherAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxEtherAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxEtherAddresses)
