import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { is } from 'ramda'

import { convertFromUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import SecondStep from './template.js'
import settings from 'config'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.paymentActions.signAndPublish(settings.NETWORK, this.props.selection)
  }

  render () {
    return <SecondStep {...this.props} handleClick={this.handleClick} />
  }
}

const selectAddress = (addressValue, selectorFunction) => {
  if (is(String, addressValue)) {
    return addressValue
  } else {
    return addressValue
      ? addressValue.address
        ? addressValue.address
        : selectorFunction(addressValue.index)
      : undefined
  }
}

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const getChange = index => selectors.core.common.getNextAvailableChangeAddress(settings.NETWORK, index, state)

  return {
    fromAddress: selectAddress(ownProps.from, getChange),
    toAddress: selectAddress(ownProps.to, getReceive),
    satoshis: convertFromUnit(ownProps.network, ownProps.amount, ownProps.unit).getOrElse({ amount: undefined, symbol: 'N/A' }).amount
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
