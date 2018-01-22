import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { path, prop } from 'ramda'

import { selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import ExchangeDetails from './template.js'

class ExchangeDetailsContainer extends React.Component {
  render () {
    const { trade, tradeStatus, address, ...rest } = this.props

    const tradeInfo = {
      status: prop('status', trade),
      exchangeRate: path(['quote', 'quotedRate'], trade),
      transactionFee: path(['quote', 'minerFee'], trade),
      orderId: path(['quote', 'orderId'], trade),
      incomingCoin: prop('incomingCoin', tradeStatus),
      incomingType: prop('incomingType', tradeStatus),
      outgoingCoin: prop('outgoingCoin', tradeStatus),
      outgoingType: prop('outgoingType', tradeStatus)
    }

    return <ExchangeDetails trade={tradeInfo} {...rest} />
  }
}

ExchangeDetailsContainer.propTypes = {
  address: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  trade: selectors.core.kvStore.shapeShift.getTrade(state, ownProps.address),
  tradeStatus: selectors.core.data.shapeShift.getTrade(state, ownProps.address)
})

const enhance = compose(
  modalEnhancer('ExchangeDetails'),
  connect(mapStateToProps)
)

export default enhance(ExchangeDetailsContainer)
