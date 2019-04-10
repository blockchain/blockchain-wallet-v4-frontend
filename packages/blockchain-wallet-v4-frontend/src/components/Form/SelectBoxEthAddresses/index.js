import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getEthData, getErc20Data } from './selectors'
import SelectBoxEth from './template'

class SelectBoxEthAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => <SelectBoxEth elements={value.data} {...rest} />,
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxEthAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxEthAddresses.defaultProps = {
  includeAll: true
}

// TODO: make more ERC20 generic
const mapStateToProps = (state, ownProps) => {
  return ownProps.coin === 'PAX'
    ? { data: getErc20Data(state, ownProps) }
    : { data: getEthData(state, ownProps) }
}

export default connect(mapStateToProps)(SelectBoxEthAddresses)
