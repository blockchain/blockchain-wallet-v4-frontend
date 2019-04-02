import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { includes } from 'ramda'

import { model } from 'data'
import { getEthData, getErc20Data } from './selectors'
import SelectBoxEth from './template'

const { ERC20_COIN_LIST } = model.coins
class SelectBoxEthAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => {
        return <SelectBoxEth elements={value.data} {...rest} />
      },
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

const mapStateToProps = (state, ownProps) => {
  return includes(ownProps.coin, ERC20_COIN_LIST)
    ? { data: getErc20Data(state, ownProps) }
    : { data: getEthData(state, ownProps) }
}

export default connect(mapStateToProps)(SelectBoxEthAddresses)
